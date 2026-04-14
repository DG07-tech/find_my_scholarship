import {
  ArrowRight,
  Bell,
  FileQuestion,
  GraduationCap,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../lib/api";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [visibility, setVisibility] = useState("public");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profileRes, scholarshipRes, announcementRes, questionRes] = await Promise.all([
          api.post("/user/profile", {}),
          api.get("/scholarships/all"),
          api.get("/announcements/all"),
          api.get("/user/questions"),
        ]);

        setProfile(profileRes.data?.user || null);
        setScholarships((scholarshipRes.data?.data || []).slice(0, 4));
        setAnnouncements(announcementRes.data?.data || []);
        setQuestions(questionRes.data?.data || []);
      } catch {
        toast.error("Unable to load dashboard data.");
      }
    };

    loadDashboard();
  }, []);

  const profileCompleteness = useMemo(() => {
    if (!profile) return 0;

    const requiredFields = [
      "fullName",
      "mobileNumber",
      "state",
      "caste",
      "religion",
      "annualIncome",
      "currentEducationLevel",
      "courseType",
    ];

    const filled = requiredFields.filter((field) => Boolean(profile[field])).length;
    return Math.round((filled / requiredFields.length) * 100);
  }, [profile]);

  const submitQuestion = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/user/questions", { question, visibility });
      if (response.data?.success) {
        setQuestions((current) => [response.data.data, ...current]);
        setQuestion("");
        toast.success("Question submitted successfully.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit question.");
    }
  };

  return (
    <div className="page-shell pb-20 pt-6">
      <section className="dashboard-shell">
        <div className="hero-card rounded-[2.2rem] p-8 md:p-10">
          <div className="section-eyebrow reveal-in">
            <Sparkles className="h-4 w-4" />
            Student dashboard
          </div>

          <h1 className="section-heading mt-5 reveal-in delay-1">
            {profile?.fullName ? `Welcome back, ${profile.fullName}.` : "Build a strong scholarship profile."}
          </h1>

          <p className="section-subtitle mt-6 reveal-in delay-2">
            Your dashboard now brings profile readiness, scholarships, announcements, and support
            questions together in a cleaner premium layout.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="metric-card card-hover">
              <span>Profile complete</span>
              <strong>{profileCompleteness}%</strong>
            </div>
            <div className="metric-card card-hover">
              <span>Scholarship picks</span>
              <strong>{scholarships.length}</strong>
            </div>
            <div className="metric-card card-hover">
              <span>My questions</span>
              <strong>{questions.length}</strong>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/user/scholarships/check-eligibility" className="primary-button">
              Check eligibility
            </Link>
            <Link to="/user/scheme" className="secondary-button">
              Browse scholarships
            </Link>
          </div>
        </div>

        <div className="section-card overflow-hidden rounded-[2rem]">
          <div className="bg-[linear-gradient(135deg,var(--primary),#236bce)] px-8 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.2rem] bg-white/15">
                <UserCircle2 className="h-9 w-9 text-white" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/75">
                  Profile snapshot
                </p>
                <h2 className="display-font mt-2 text-[2rem] font-bold">
                  {profile?.username || "Student"}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-4 text-sm leading-7 text-[var(--ink-soft)]">
              <p>
                <strong className="text-[var(--ink)]">Email:</strong> {profile?.email || "Not available"}
              </p>
              <p>
                <strong className="text-[var(--ink)]">State:</strong> {profile?.state || "Add in profile"}
              </p>
              <p>
                <strong className="text-[var(--ink)]">Category:</strong> {profile?.caste || "Add in profile"}
              </p>
              <p>
                <strong className="text-[var(--ink)]">Study level:</strong>{" "}
                {profile?.currentEducationLevel || "Add in eligibility form"}
              </p>
            </div>

            <Link to="/user/scholarships/check-eligibility" className="secondary-button mt-6 w-full">
              Update profile details
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section grid gap-6 xl:grid-cols-[1fr_0.92fr]">
        <div className="section-card rounded-[2rem] p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="section-eyebrow">
                <GraduationCap className="h-4 w-4" />
                Recommended scholarships
              </div>
              <h2 className="display-font mt-4 text-[2rem] font-bold tracking-[-0.04em] text-[var(--ink)]">
                Scholarship picks for this week
              </h2>
            </div>
            <Link
              to="/user/scheme"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--primary)]"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4">
            {scholarships.map((item) => (
              <article key={item._id} className="panel-soft card-hover rounded-[1.4rem] p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--secondary)]">
                  {item.provider || item.category || "Scholarship"}
                </p>
                <h3 className="mt-3 text-[1.35rem] font-extrabold leading-tight text-[var(--ink)]">
                  {item.schemeName}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                  {item.summary || item.benefits}
                </p>
                <div className="mt-4">
                  <Link to={`/user/scheme/${item._id}`} className="secondary-button">
                    Review details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="section-card rounded-[2rem] p-7">
            <div className="mb-5 flex items-center gap-3">
              <Bell className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="display-font text-[1.8rem] font-bold text-[var(--ink)]">Announcements</h2>
            </div>

            <div className="space-y-4">
              {announcements.length ? (
                announcements.slice(0, 4).map((item) => (
                  <div key={item._id || item.title} className="panel-soft card-hover rounded-[1.35rem] p-4">
                    <h3 className="font-bold text-[var(--ink)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{item.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--ink-soft)]">No announcements available right now.</p>
              )}
            </div>
          </div>

          <div className="section-card rounded-[2rem] p-7">
            <div className="mb-5 flex items-center gap-3">
              <FileQuestion className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="display-font text-[1.8rem] font-bold text-[var(--ink)]">
                Help and questions
              </h2>
            </div>

            <form className="space-y-4" onSubmit={submitQuestion}>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about eligibility, deadlines, documents, or application links"
                className="textarea-shell"
                rows={4}
                required
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <select
                  value={visibility}
                  onChange={(event) => setVisibility(event.target.value)}
                  className="select-shell max-w-[220px]"
                >
                  <option value="public">Public question</option>
                  <option value="private">Private question</option>
                </select>
                <button className="primary-button" type="submit">
                  Submit question
                </button>
              </div>
            </form>

            <div className="mt-6 space-y-3">
              {questions.slice(0, 4).map((item) => (
                <div key={item._id} className="panel-soft card-hover rounded-[1.35rem] p-4">
                  <p className="font-semibold text-[var(--ink)]">{item.question}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    {item.status} | {item.visibility}
                  </p>
                  {item.answer && (
                    <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
