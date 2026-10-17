import { Link } from "react-router-dom";
import {
  Brain,
  Target,
  BarChart3,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* ================= NAVBAR ================= */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Brain size={21} />
            </div>

            <span className="text-xl font-bold text-gray-900">
              Edu<span className="text-primary-600">Adapt</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-sm font-medium text-primary-600">
              Home
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-primary-600"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-primary-600"
            >
              How It Works
            </a>

            <Link
              to="/resources"
              className="text-sm font-medium text-gray-600 hover:text-primary-600"
            >
              Resources
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-sm font-semibold text-gray-700 hover:text-primary-600 sm:block"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn-primary inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="bg-gradient-to-br from-primary-50 via-white to-white"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          {/* Hero Text */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
              <Sparkles size={16} />
              Personalized Learning Experience
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Learn Smarter.
              <br />
              <span className="text-primary-600">Quiz Smarter.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              EduAdapt helps students improve through adaptive quizzes,
              performance tracking, weak-area detection, and personalized
              learning recommendations.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3"
              >
                Start Learning
                <ArrowRight size={18} />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:border-primary-400 hover:text-primary-600"
              >
                How It Works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-500" />
                Personalized quizzes
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-500" />
                Performance tracking
              </span>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="relative">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Student Dashboard</p>
                  <h3 className="text-xl font-bold text-gray-900">
                    Your Learning Progress
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <BarChart3 size={20} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Quizzes</p>
                  <p className="mt-1 text-2xl font-bold">24</p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Avg. Score</p>
                  <p className="mt-1 text-2xl font-bold text-primary-600">
                    78%
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Accuracy</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">82%</p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Answered</p>
                  <p className="mt-1 text-2xl font-bold">240</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-5 rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">
                    Learning Progress
                  </p>
                  <span className="text-sm font-semibold text-primary-600">
                    82%
                  </span>
                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-[82%] rounded-full bg-primary-600" />
                </div>
              </div>

              {/* Weak Area */}
              <div className="mt-4 flex items-center gap-4 rounded-xl bg-primary-50 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600">
                  <Target size={21} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">Recommended Focus</p>
                  <p className="font-semibold text-gray-800">
                    Algorithms & Problem Solving
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-primary-600">WHY EDUADAPT</p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Learning that adapts to you
            </h2>

            <p className="mt-4 text-gray-600">
              EduAdapt combines quizzes, analytics, and recommendations to help
              students understand where they need to improve.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Target size={23} />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Adaptive Quizzes
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Quiz difficulty can adjust according to student performance for
                a more personalized learning experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <BarChart3 size={23} />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Performance Tracking
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Track quiz scores, accuracy, attempts, and overall learning
                progress from one dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <BookOpen size={23} />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Personalized Recommendations
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Discover weak areas and receive recommendations to focus on the
                topics that need more practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-primary-600">HOW IT WORKS</p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Simple steps. Smarter learning.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              {
                number: "01",
                title: "Choose a Topic",
                text: "Select the subject or topic you want to practice.",
              },
              {
                number: "02",
                title: "Take a Quiz",
                text: "Answer questions based on your selected topic.",
              },
              {
                number: "03",
                title: "Analyze Results",
                text: "Your performance and accuracy are analyzed.",
              },
              {
                number: "04",
                title: "Improve",
                text: "Focus on weak areas with personalized recommendations.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <span className="text-sm font-bold text-primary-600">
                  {step.number}
                </span>

                <h3 className="mt-3 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl bg-primary-600 px-6 py-14 text-center text-white shadow-xl sm:px-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to improve your learning?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-primary-100">
              Start practicing, track your performance, and discover where you
              can improve.
            </p>

            <Link
              to="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 transition hover:bg-gray-100"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-gray-900">
              Edu<span className="text-primary-600">Adapt</span>
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Adaptive learning for better outcomes.
            </p>
          </div>

          <div className="flex gap-5 text-sm text-gray-500">
            <Link to="/login" className="hover:text-primary-600">
              Login
            </Link>

            <Link to="/register" className="hover:text-primary-600">
              Register
            </Link>

            <Link to="/resources" className="hover:text-primary-600">
              Resources
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
