-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'leader', 'member');

-- Create enum for member status
CREATE TYPE public.member_status AS ENUM ('active', 'stalled', 'ghost');

-- Create enum for activity type
CREATE TYPE public.activity_type AS ENUM ('commit', 'pr', 'pr_review');

-- Create enum for blocker status
CREATE TYPE public.blocker_status AS ENUM ('active', 'resolved');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  github_username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  leader_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  repo_url TEXT,
  invite_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_members table
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member',
  dependency_id UUID REFERENCES public.project_members(id) ON DELETE SET NULL,
  status member_status DEFAULT 'active',
  contribution_score INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Create github_activity table
CREATE TABLE public.github_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  type activity_type NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blocker_signals table
CREATE TABLE public.blocker_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status blocker_status DEFAULT 'active',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocker_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view projects they lead or are members of" ON public.projects FOR SELECT TO authenticated 
  USING (leader_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.project_members WHERE project_id = projects.id AND user_id = auth.uid()
  ));
CREATE POLICY "Leaders can create projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (leader_id = auth.uid());
CREATE POLICY "Leaders can update their projects" ON public.projects FOR UPDATE TO authenticated USING (leader_id = auth.uid());
CREATE POLICY "Leaders can delete their projects" ON public.projects FOR DELETE TO authenticated USING (leader_id = auth.uid());

-- Project members policies
CREATE POLICY "Members can view project members" ON public.project_members FOR SELECT TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.projects WHERE id = project_members.project_id AND (leader_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.project_members pm WHERE pm.project_id = projects.id AND pm.user_id = auth.uid()
    ))
  ));
CREATE POLICY "Leaders can add members" ON public.project_members FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND leader_id = auth.uid()) OR user_id = auth.uid());
CREATE POLICY "Leaders can update members" ON public.project_members FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND leader_id = auth.uid()) OR user_id = auth.uid());
CREATE POLICY "Leaders can remove members" ON public.project_members FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND leader_id = auth.uid()));

-- GitHub activity policies
CREATE POLICY "Users can view activity for their projects" ON public.github_activity FOR SELECT TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.project_members WHERE project_id = github_activity.project_id AND user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.projects WHERE id = github_activity.project_id AND leader_id = auth.uid()
  ));
CREATE POLICY "Users can insert their own activity" ON public.github_activity FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Blocker signals policies
CREATE POLICY "Users can view blockers in their projects" ON public.blocker_signals FOR SELECT TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.project_members WHERE project_id = blocker_signals.project_id AND user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.projects WHERE id = blocker_signals.project_id AND leader_id = auth.uid()
  ));
CREATE POLICY "Users can create blocker signals" ON public.blocker_signals FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own blockers" ON public.blocker_signals FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Create function for handling new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'avatar_url');
  RETURN new;
END;
$$;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_members_updated_at BEFORE UPDATE ON public.project_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();