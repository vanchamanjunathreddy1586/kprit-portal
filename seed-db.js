const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '.env.vercel.local' });

async function run() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase Postgres!');

    const sql = `
-- Drop existing tables if needed for a clean state
DROP TABLE IF EXISTS public.results CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.semesters CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.grading_rules CASCADE;

-- 1. Create Tables
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    college VARCHAR(100) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    current_year INTEGER NOT NULL,
    current_semester INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_number INTEGER NOT NULL,
    semester_name VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(semester_number, academic_year)
);

CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id UUID REFERENCES public.semesters(id) ON DELETE CASCADE,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    subject_type VARCHAR(20) NOT NULL,
    credits INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(subject_code, semester_id)
);

CREATE TABLE public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    semester_id UUID REFERENCES public.semesters(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    internal_marks INTEGER NOT NULL,
    external_marks INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    grade VARCHAR(5) NOT NULL,
    grade_point NUMERIC(4,2) NOT NULL,
    result_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, subject_id)
);

CREATE TABLE public.grading_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade VARCHAR(5) UNIQUE NOT NULL,
    minimum_marks INTEGER NOT NULL,
    maximum_marks INTEGER NOT NULL,
    grade_point NUMERIC(4,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Setup Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own profile" ON public.students FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Anyone can view semesters" ON public.semesters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view grading rules" ON public.grading_rules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can view their own results" ON public.results FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid())
);

-- 3. Seed Grading Rules
INSERT INTO public.grading_rules (grade, minimum_marks, maximum_marks, grade_point) VALUES
('O', 90, 100, 10.0),
('A+', 80, 89, 9.0),
('A', 70, 79, 8.0),
('B+', 60, 69, 7.0),
('B', 50, 59, 6.0),
('C', 40, 49, 5.0),
('F', 0, 39, 0.0);

-- 4. Seed Semesters and Subjects Data
DO $$
DECLARE
    sem1_id UUID := gen_random_uuid();
    sem2_id UUID := gen_random_uuid();
    demo_student_id UUID := gen_random_uuid();
BEGIN
    -- Semesters
    INSERT INTO public.semesters (id, semester_number, semester_name, academic_year) VALUES
    (sem1_id, 1, 'Semester 1', '2025-2026'),
    (sem2_id, 2, 'Semester 2', '2025-2026');

    -- Semester 1 Subjects
    INSERT INTO public.subjects (id, semester_id, subject_code, subject_name, subject_type, credits) VALUES
    (gen_random_uuid(), sem1_id, 'MAT101', 'Matrices and Calculus', 'Theory', 4),
    (gen_random_uuid(), sem1_id, 'CHE102', 'Engineering Chemistry', 'Theory', 4),
    (gen_random_uuid(), sem1_id, 'PPS103', 'Programming for Problem Solving (PPS)', 'Theory', 4),
    (gen_random_uuid(), sem1_id, 'ENG104', 'English', 'Theory', 3),
    (gen_random_uuid(), sem1_id, 'EDC105', 'Electronic Devices and Circuits (EDC)', 'Theory', 3),
    (gen_random_uuid(), sem1_id, 'EWS106', 'EWS Lab', 'Laboratory', 2);

    -- Semester 2 Subjects
    INSERT INTO public.subjects (id, semester_id, subject_code, subject_name, subject_type, credits) VALUES
    (gen_random_uuid(), sem2_id, 'ODE201', 'ODEAVC', 'Theory', 4),
    (gen_random_uuid(), sem2_id, 'PHY202', 'Advanced Physics', 'Theory', 4),
    (gen_random_uuid(), sem2_id, 'EGD203', 'Engineering Drawing', 'Theory', 3),
    (gen_random_uuid(), sem2_id, 'BEE204', 'BEE', 'Theory', 3),
    (gen_random_uuid(), sem2_id, 'DS205', 'Data Structures (DS)', 'Theory', 3),
    (gen_random_uuid(), sem2_id, 'PYL206', 'Python Lab', 'Laboratory', 1),
    (gen_random_uuid(), sem2_id, 'ITW207', 'IT Workshop', 'Laboratory', 1);
    
    -- We can't link the student to auth.users yet since auth.users is managed by Supabase API.
    -- But we can create the student record without auth_user_id for now, and the user can update it later.
    INSERT INTO public.students (id, student_id, full_name, email, roll_number, college, branch, academic_year, current_year, current_semester)
    VALUES (demo_student_id, '25ra1a05bv', 'Vancha Manjunath Reddy', '25ra1a05bv@kpritech.ac.in', '25RA1A05BV', 'KPRIT', 'Computer Science and Engineering', '2025-2026', 1, 2);
    
    -- Insert Results for Semester 1 (7.00 SGPA)
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem1_id, id, 24, 46, 70, 'B+', 7.0, 'PASS' FROM public.subjects WHERE subject_code = 'MAT101';
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem1_id, id, 22, 40, 62, 'B', 6.0, 'PASS' FROM public.subjects WHERE subject_code = 'CHE102';
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem1_id, id, 25, 52, 77, 'A', 8.0, 'PASS' FROM public.subjects WHERE subject_code = 'PPS103';
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem1_id, id, 26, 42, 68, 'B+', 7.0, 'PASS' FROM public.subjects WHERE subject_code = 'ENG104';
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem1_id, id, 24, 44, 68, 'B+', 7.0, 'PASS' FROM public.subjects WHERE subject_code = 'EDC105';
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem1_id, id, 20, 40, 60, 'B', 6.0, 'PASS' FROM public.subjects WHERE subject_code = 'EWS106';

    -- Insert Results for Semester 2 (7.20 SGPA)
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem2_id, id, 25, 48, 73, 'B+', 7.0, 'PASS' FROM public.subjects WHERE subject_code = 'ODE201';
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem2_id, id, 23, 41, 64, 'B', 6.0, 'PASS' FROM public.subjects WHERE subject_code = 'PHY202';
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem2_id, id, 27, 55, 82, 'A', 8.0, 'PASS' FROM public.subjects WHERE subject_code = 'EGD203';
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem2_id, id, 24, 45, 69, 'B+', 7.0, 'PASS' FROM public.subjects WHERE subject_code = 'BEE204';
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem2_id, id, 28, 65, 93, 'O', 10.0, 'PASS' FROM public.subjects WHERE subject_code = 'DS205';
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem2_id, id, 22, 43, 65, 'B+', 7.0, 'PASS' FROM public.subjects WHERE subject_code = 'PYL206';
    INSERT INTO public.results (student_id, semester_id, subject_id, internal_marks, external_marks, total_marks, grade, grade_point, result_status)
    SELECT demo_student_id, sem2_id, id, 21, 40, 61, 'B', 6.0, 'PASS' FROM public.subjects WHERE subject_code = 'ITW207';
END $$;
    `;

    await client.query(sql);
    console.log('Successfully seeded database!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

run();
