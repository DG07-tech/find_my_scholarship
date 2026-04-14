import {
  Bell,
  Building2,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  PencilLine,
  PlusCircle,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import StudentsTable from "../../components/dashboard/StudentsTable";
import { api } from "../../lib/api";
import { getCookie } from "../../lib/auth";

const emptySchemeForm = {
  schemeName: "",
  gender: "Both",
  state: "All",
  areaOfResidence: "Both",
  casteCategory: "All",
  annualIncome: "",
  religion: "All",
  benefits: "",
  schemeDocuments: "",
  siteLink: "",
};

const emptyAnnouncementForm = { title: "", content: "" };

const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "schemes", label: "Schemes", icon: GraduationCap },
  { id: "announcements", label: "Announcements", icon: Bell },
  { id: "questions", label: "Questions", icon: FileQuestion },
  { id: "students", label: "Students", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [adminProfile, setAdminProfile] = useState(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    notifications: {
      userQueries: true,
      newUsers: true,
      eligibilityChecks: true,
    },
  });
  const [schemes, setSchemes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schemeForm, setSchemeForm] = useState(emptySchemeForm);
  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncementForm);
  const [editingScheme, setEditingScheme] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const refreshData = async () => {
    try {
      setLoading(true);
      const token = getCookie("token");

      const [schemesRes, announcementsRes, questionsRes, profileRes, settingsRes] = await Promise.all([
        api.get("/scholarships/all"),
        api.get("/announcements/all"),
        api.get("/admin/questions"),
        api.post("/admin/profile", { token }),
        api.get("/admin/settings"),
      ]);

      setSchemes(schemesRes.data?.data || []);
      setAnnouncements(announcementsRes.data?.data || []);
      setQuestions(questionsRes.data?.data || []);
      setAdminProfile(profileRes.data?.data || null);
      setSettings(
        settingsRes.data?.data || {
          emailNotifications: true,
          notifications: {
            userQueries: true,
            newUsers: true,
            eligibilityChecks: true,
          },
        }
      );
    } catch {
      toast.error("Unable to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const dashboardStats = useMemo(
    () => [
      { label: "Live scholarships", value: schemes.length },
      { label: "Announcements", value: announcements.length },
      { label: "Open questions", value: questions.filter((item) => item.status !== "Answered").length },
    ],
    [announcements.length, questions, schemes.length]
  );

  const openCreateScheme = () => {
    setEditingScheme(null);
    setSchemeForm(emptySchemeForm);
    setShowSchemeModal(true);
  };

  const openEditScheme = (scheme) => {
    setEditingScheme(scheme);
    setSchemeForm({
      schemeName: scheme.schemeName || "",
      gender: scheme.gender || "Both",
      state: scheme.state || "All",
      areaOfResidence: scheme.areaOfResidence || "Both",
      casteCategory: scheme.casteCategory || "All",
      annualIncome: scheme.annualIncome || "",
      religion: scheme.religion || "All",
      benefits: scheme.benefits || "",
      schemeDocuments: scheme.schemeDocuments || "",
      siteLink: scheme.siteLink || "",
    });
    setShowSchemeModal(true);
  };

  const saveScheme = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const endpoint = editingScheme
        ? `/admin/editscheme/${editingScheme._id}`
        : "/admin/addscheme";
      const method = editingScheme ? "put" : "post";

      const response = await api[method](endpoint, schemeForm);
      if (response.data?.success || response.status === 201) {
        toast.success(editingScheme ? "Scheme updated successfully." : "Scheme added successfully.");
        setShowSchemeModal(false);
        setSchemeForm(emptySchemeForm);
        setEditingScheme(null);
        refreshData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save scheme.");
    } finally {
      setSaving(false);
    }
  };

  const deleteScheme = async (schemeId) => {
    try {
      const response = await api.delete(`/admin/deletescheme/${schemeId}`);
      if (response.data?.success) {
        toast.success("Scheme deleted successfully.");
        refreshData();
      }
    } catch {
      toast.error("Unable to delete scheme.");
    }
  };

  const openCreateAnnouncement = () => {
    setEditingAnnouncement(null);
    setAnnouncementForm(emptyAnnouncementForm);
    setShowAnnouncementModal(true);
  };

  const openEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title || "",
      content: announcement.content || "",
    });
    setShowAnnouncementModal(true);
  };

  const saveAnnouncement = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const endpoint = editingAnnouncement
        ? `/admin/editannouncement/${editingAnnouncement._id}`
        : "/admin/addannouncements";
      const method = editingAnnouncement ? "put" : "post";
      const response = await api[method](endpoint, announcementForm);
      if (response.data?.success || response.status === 201) {
        toast.success(
          editingAnnouncement ? "Announcement updated successfully." : "Announcement sent successfully."
        );
        setShowAnnouncementModal(false);
        setAnnouncementForm(emptyAnnouncementForm);
        setEditingAnnouncement(null);
        refreshData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save announcement.");
    } finally {
      setSaving(false);
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    try {
      const response = await api.delete(`/admin/deleteannouncement/${announcementId}`);
      if (response.data?.success) {
        toast.success("Announcement deleted successfully.");
        refreshData();
      }
    } catch {
      toast.error("Unable to delete announcement.");
    }
  };

  const openAnswerModal = (question) => {
    setSelectedQuestion(question);
    setAnswer(question.answer || "");
    setShowAnswerModal(true);
  };

  const submitAnswer = async () => {
    if (!selectedQuestion?._id) return;

    try {
      const response = await api.put(`/admin/questions/${selectedQuestion._id}`, {
        answer,
        status: "Answered",
      });
      if (response.data?.success) {
        toast.success("Answer saved successfully.");
        setShowAnswerModal(false);
        setSelectedQuestion(null);
        setAnswer("");
        refreshData();
      }
    } catch {
      toast.error("Unable to save answer.");
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      const response = await api.delete(`/admin/questions/${questionId}`);
      if (response.data?.success) {
        toast.success("Question deleted successfully.");
        refreshData();
      }
    } catch {
      toast.error("Unable to delete question.");
    }
  };

  const saveSettings = async () => {
    const token = getCookie("token");

    try {
      setSaving(true);
      await Promise.all([
        api.put("/admin/profile", {
          token,
          fullName: adminProfile?.fullName,
          email: adminProfile?.email,
          mobileNumber: adminProfile?.mobileNumber || adminProfile?.phoneNumber || "",
        }),
        api.put("/admin/settings", {
          notifications: settings.notifications,
        }),
      ]);
      toast.success("Admin settings updated successfully.");
      refreshData();
    } catch {
      toast.error("Unable to update settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell pb-20 pt-6">
      <div className="admin-shell">
        <aside className="admin-sidebar section-card rounded-[2rem] p-5">
          <div className="rounded-[1.6rem] bg-[linear-gradient(135deg,var(--primary),#236bce)] p-5 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/75">Admin control</p>
            <h2 className="display-font mt-3 text-[1.7rem] font-bold">
              {adminProfile?.username || adminProfile?.fullName || "Admin"}
            </h2>
            <p className="mt-2 text-sm text-white/80">{adminProfile?.email || "Managing platform operations"}</p>
          </div>

          <nav className="mt-5 grid gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`nav-pill w-full justify-start ${
                  activeSection === section.id ? "is-active" : ""
                }`}
              >
                <section.icon className="h-4 w-4" />
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="space-y-6">
          <div className="hero-card rounded-[2.2rem] p-8 md:p-10">
            <div className="section-eyebrow">
              <Sparkles className="h-4 w-4" />
              Admin dashboard
            </div>
            <h1 className="section-heading mt-5">
              Manage scholarships, announcements, questions, students, and settings from one polished control center.
            </h1>
            <p className="section-subtitle mt-6">
              The admin experience now follows the same premium light design system as the public and student-facing screens.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {dashboardStats.map((item) => (
                <div key={item.label} className="metric-card card-hover">
                  <span>{item.label}</span>
                  <strong>{loading ? "..." : item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          {activeSection === "overview" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
              <div className="section-card rounded-[2rem] p-7">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="display-font text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                    Recent scholarships
                  </h2>
                  <button type="button" className="primary-button" onClick={openCreateScheme}>
                    <PlusCircle className="h-4 w-4" />
                    Add scheme
                  </button>
                </div>
                <div className="grid gap-4">
                  {schemes.slice(0, 4).map((scheme) => (
                    <article key={scheme._id} className="panel-soft card-hover p-5">
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--secondary)]">
                        {scheme.provider || scheme.category || "Scholarship"}
                      </p>
                      <h3 className="mt-3 text-xl font-extrabold text-[var(--ink)]">{scheme.schemeName}</h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{scheme.benefits}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="section-card rounded-[2rem] p-7">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="display-font text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                      Latest announcements
                    </h2>
                    <button type="button" className="secondary-button" onClick={openCreateAnnouncement}>
                      New
                    </button>
                  </div>
                  <div className="space-y-3">
                    {announcements.slice(0, 3).map((item) => (
                      <div key={item._id} className="panel-soft p-4">
                        <p className="font-bold text-[var(--ink)]">{item.title}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section-card rounded-[2rem] p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-[var(--primary)]" />
                    <h2 className="display-font text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                      Quick actions
                    </h2>
                  </div>
                  <div className="grid gap-3">
                    <button type="button" className="primary-button justify-start" onClick={() => setActiveSection("questions")}>
                      <FileQuestion className="h-4 w-4" />
                      Review student questions
                    </button>
                    <button type="button" className="secondary-button justify-start" onClick={() => setActiveSection("students")}>
                      <Users className="h-4 w-4" />
                      Manage students
                    </button>
                    <button type="button" className="secondary-button justify-start" onClick={() => setActiveSection("settings")}>
                      <Settings className="h-4 w-4" />
                      Update settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "schemes" && (
            <div className="section-card rounded-[2rem] p-7">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="section-eyebrow">
                    <Building2 className="h-4 w-4" />
                    Scholarship management
                  </div>
                  <h2 className="display-font mt-4 text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                    Create and maintain scholarship records
                  </h2>
                </div>
                <button type="button" className="primary-button" onClick={openCreateScheme}>
                  <PlusCircle className="h-4 w-4" />
                  Add scholarship
                </button>
              </div>

              <div className="scholarship-grid">
                {schemes.map((scheme) => (
                  <article key={scheme._id} className="section-card card-hover flex h-full flex-col p-6">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--secondary)]">
                      {scheme.provider || scheme.category || "Scholarship"}
                    </p>
                    <h3 className="mt-3 text-[1.45rem] font-extrabold text-[var(--ink)]">{scheme.schemeName}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-[var(--ink-soft)]">{scheme.benefits}</p>
                    <div className="mt-6 flex gap-3">
                      <button type="button" className="secondary-button flex-1" onClick={() => openEditScheme(scheme)}>
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </button>
                      <button type="button" className="ghost-button flex-1" onClick={() => deleteScheme(scheme._id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeSection === "announcements" && (
            <div className="section-card rounded-[2rem] p-7">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="section-eyebrow">
                    <Bell className="h-4 w-4" />
                    Platform updates
                  </div>
                  <h2 className="display-font mt-4 text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                    Publish announcements with better visibility
                  </h2>
                </div>
                <button type="button" className="primary-button" onClick={openCreateAnnouncement}>
                  <PlusCircle className="h-4 w-4" />
                  Add announcement
                </button>
              </div>

              <div className="grid gap-4">
                {announcements.map((item) => (
                  <article key={item._id} className="panel-soft p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-extrabold text-[var(--ink)]">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{item.content}</p>
                      </div>
                      <div className="flex gap-3">
                        <button type="button" className="secondary-button" onClick={() => openEditAnnouncement(item)}>
                          Edit
                        </button>
                        <button type="button" className="ghost-button" onClick={() => deleteAnnouncement(item._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeSection === "questions" && (
            <div className="section-card rounded-[2rem] p-7">
              <div className="mb-6">
                <div className="section-eyebrow">
                  <FileQuestion className="h-4 w-4" />
                  Student support
                </div>
                <h2 className="display-font mt-4 text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                  Review and answer student questions
                </h2>
              </div>

              <div className="grid gap-4">
                {questions.map((item) => (
                  <article key={item._id} className="panel-soft p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap gap-2">
                          <span className={`status-chip ${item.status === "Answered" ? "is-success" : "is-warning"}`}>
                            {item.status}
                          </span>
                          <span className="tag-chip">{item.visibility}</span>
                        </div>
                        <h3 className="mt-4 text-lg font-extrabold text-[var(--ink)]">{item.question}</h3>
                        <p className="mt-2 text-sm text-[var(--ink-soft)]">
                          Asked by {item.user?.username || "Student"} ({item.user?.email || "No email"})
                        </p>
                        {item.answer && (
                          <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">{item.answer}</p>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button type="button" className="secondary-button" onClick={() => openAnswerModal(item)}>
                          {item.status === "Answered" ? "Edit answer" : "Answer"}
                        </button>
                        <button type="button" className="ghost-button" onClick={() => deleteQuestion(item._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeSection === "students" && (
            <div className="section-card rounded-[2rem] p-7">
              <StudentsTable />
            </div>
          )}

          {activeSection === "settings" && (
            <div className="section-card rounded-[2rem] p-7">
              <div className="mb-6">
                <div className="section-eyebrow">
                  <Settings className="h-4 w-4" />
                  Admin settings
                </div>
                <h2 className="display-font mt-4 text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                  Update your profile and notification controls
                </h2>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-5">
                  <label className="form-field">
                    <span>Full name</span>
                    <input
                      className="input-shell plain"
                      value={adminProfile?.fullName || ""}
                      onChange={(event) =>
                        setAdminProfile((current) => ({ ...current, fullName: event.target.value }))
                      }
                    />
                  </label>
                  <label className="form-field">
                    <span>Email</span>
                    <input
                      className="input-shell plain"
                      value={adminProfile?.email || ""}
                      onChange={(event) =>
                        setAdminProfile((current) => ({ ...current, email: event.target.value }))
                      }
                    />
                  </label>
                  <label className="form-field">
                    <span>Phone number</span>
                    <input
                      className="input-shell plain"
                      value={adminProfile?.mobileNumber || adminProfile?.phoneNumber || ""}
                      onChange={(event) =>
                        setAdminProfile((current) => ({ ...current, mobileNumber: event.target.value }))
                      }
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  {[
                    ["userQueries", "Notify for user questions"],
                    ["newUsers", "Notify for new users"],
                    ["eligibilityChecks", "Notify for eligibility checks"],
                  ].map(([key, label]) => (
                    <label key={key} className="checkbox-shell">
                      <input
                        type="checkbox"
                        checked={Boolean(settings.notifications?.[key])}
                        onChange={(event) =>
                          setSettings((current) => ({
                            ...current,
                            notifications: {
                              ...current.notifications,
                              [key]: event.target.checked,
                            },
                          }))
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="button" className="primary-button mt-6" onClick={saveSettings} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          )}
        </section>
      </div>

      {showSchemeModal && (
        <div className="modal-backdrop">
          <div className="modal-card p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="display-font text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                {editingScheme ? "Edit scholarship" : "Add scholarship"}
              </h2>
              <button type="button" className="icon-button" onClick={() => setShowSchemeModal(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={saveScheme}>
              {[
                ["schemeName", "Scheme name"],
                ["gender", "Gender"],
                ["state", "State"],
                ["areaOfResidence", "Area of residence"],
                ["casteCategory", "Caste category"],
                ["annualIncome", "Annual income"],
                ["religion", "Religion"],
                ["schemeDocuments", "Scheme documents URL"],
                ["siteLink", "Application URL"],
              ].map(([key, label]) => (
                <label key={key} className={`form-field ${key === "siteLink" ? "" : ""}`}>
                  <span>{label}</span>
                  <input
                    className="input-shell plain"
                    value={schemeForm[key]}
                    onChange={(event) =>
                      setSchemeForm((current) => ({ ...current, [key]: event.target.value }))
                    }
                    required
                  />
                </label>
              ))}

              <label className="form-field md:col-span-2">
                <span>Benefits</span>
                <textarea
                  className="textarea-shell"
                  value={schemeForm.benefits}
                  onChange={(event) =>
                    setSchemeForm((current) => ({ ...current, benefits: event.target.value }))
                  }
                  required
                />
              </label>

              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? "Saving..." : "Save scholarship"}
                </button>
                <button type="button" className="secondary-button" onClick={() => setShowSchemeModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAnnouncementModal && (
        <div className="modal-backdrop">
          <div className="modal-card max-w-[760px] p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="display-font text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                {editingAnnouncement ? "Edit announcement" : "Add announcement"}
              </h2>
              <button type="button" className="icon-button" onClick={() => setShowAnnouncementModal(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={saveAnnouncement}>
              <label className="form-field">
                <span>Title</span>
                <input
                  className="input-shell plain"
                  value={announcementForm.title}
                  onChange={(event) =>
                    setAnnouncementForm((current) => ({ ...current, title: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="form-field">
                <span>Content</span>
                <textarea
                  className="textarea-shell"
                  value={announcementForm.content}
                  onChange={(event) =>
                    setAnnouncementForm((current) => ({ ...current, content: event.target.value }))
                  }
                  required
                />
              </label>
              <div className="flex gap-3">
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? "Saving..." : "Save announcement"}
                </button>
                <button type="button" className="secondary-button" onClick={() => setShowAnnouncementModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAnswerModal && selectedQuestion && (
        <div className="modal-backdrop">
          <div className="modal-card max-w-[760px] p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="display-font text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                Answer student question
              </h2>
              <button type="button" className="icon-button" onClick={() => setShowAnswerModal(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="panel-soft mt-6 p-5">
              <p className="font-bold text-[var(--ink)]">{selectedQuestion.question}</p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                Asked by {selectedQuestion.user?.username || "Student"}
              </p>
            </div>

            <label className="form-field mt-5">
              <span>Answer</span>
              <textarea className="textarea-shell" value={answer} onChange={(event) => setAnswer(event.target.value)} />
            </label>

            <div className="mt-6 flex gap-3">
              <button type="button" className="primary-button" onClick={submitAnswer}>
                Save answer
              </button>
              <button type="button" className="secondary-button" onClick={() => setShowAnswerModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
