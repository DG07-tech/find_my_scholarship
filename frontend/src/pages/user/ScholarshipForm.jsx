import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileSearch,
  GraduationCap,
  Lightbulb,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../lib/api";
import {
  CASTES,
  COURSE_TYPES,
  EDUCATION_LEVELS,
  GENDERS,
  RELIGIONS,
  STATES,
  YEARS_OF_STUDY,
} from "../../lib/options";

const initialFormState = {
  fullName: "",
  dateOfBirth: "",
  parentName: "",
  mobileNumber: "",
  parentMobileNumber: "",
  annualIncome: "",
  profession: "",
  caste: "General",
  gender: "Male",
  religion: "Hindu",
  state: "Maharashtra",
  minorityStatus: false,
  bplStatus: false,
  singleParent: false,
  disabledStatus: false,
  tenthMarks: "",
  twelfthMarks: "",
  collegeName: "",
  courseName: "",
  currentEducationLevel: "Undergraduate",
  courseType: "General",
  yearOfStudy: "First Year",
  scholarshipCriteria: "",
  areaOfResidence: "Urban",
};

const ScholarshipForm = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [nearMissSchemes, setNearMissSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.post("/user/profile", {});
        const user = response.data?.user;

        if (user) {
          setFormState((current) => ({
            ...current,
            ...Object.fromEntries(
              Object.entries(current).map(([key, value]) => [key, user[key] ?? value])
            ),
          }));
        }
      } catch {
        toast.error("Unable to load your saved profile.");
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, []);

  const resultStats = useMemo(
    () => [
      { label: "Eligible scholarships", value: eligibleSchemes.length },
      { label: "Near-match scholarships", value: nearMissSchemes.length },
      { label: "Profile readiness", value: "Saved" },
    ],
    [eligibleSchemes.length, nearMissSchemes.length]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/user/scholarships/check-eligibility", formState);
      if (response.data?.success) {
        setEligibleSchemes(response.data.eligibleSchemes || []);
        setNearMissSchemes(response.data.nearMissSchemes || []);
        toast.success(response.data.message || "Eligibility updated successfully.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to check eligibility.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell pb-16 pt-5 md:pb-20">
      <section className="hero-card overflow-hidden px-6 py-8 md:px-8 md:py-10">
        <div className="dashboard-shell">
          <div>
            <div className="section-eyebrow reveal-in">
              <Sparkles className="h-4 w-4" />
              Eligibility checker
            </div>
            <h1 className="section-heading mt-5 reveal-in delay-1">
              Turn your profile into a smarter scholarship recommendation flow.
            </h1>
            <p className="section-subtitle mt-6 reveal-in delay-2">
              Complete the required profile details once, save them to your account, and get a
              clearer shortlist of scholarships that fit your background and academic journey.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {resultStats.map((item, index) => (
                <div key={item.label} className={`metric-card reveal-in delay-${index + 1}`}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card rounded-[2rem] p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-[var(--primary-soft)] text-[var(--primary)]">
                <SearchCheck className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                  Profile-powered matching
                </p>
                <h2 className="display-font mt-1 text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                  Cleaner decisions, better fit
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Required fields are preserved to match your existing backend flow",
                "Eligible and near-match scholarships are shown after submission",
                "Profile values load automatically when available",
              ].map((item) => (
                <div key={item} className="panel-soft flex items-start gap-3 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
                  <span className="text-sm leading-6 text-[var(--ink-soft)]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section two-column-layout">
        <form className="section-card p-6 md:p-8" onSubmit={handleSubmit}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="section-eyebrow">
                <FileSearch className="h-4 w-4" />
                Student profile
              </div>
              <h2 className="display-font mt-4 text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                Complete your eligibility form
              </h2>
            </div>
            {profileLoading && (
              <div className="rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-bold text-[var(--ink-soft)]">
                Loading profile...
              </div>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="form-field">
              <span>Full name</span>
              <input className="input-shell plain" name="fullName" value={formState.fullName} onChange={handleChange} required />
            </label>
            <label className="form-field">
              <span>Date of birth</span>
              <input className="input-shell plain" type="date" name="dateOfBirth" value={formState.dateOfBirth} onChange={handleChange} required />
            </label>
            <label className="form-field">
              <span>Parent name</span>
              <input className="input-shell plain" name="parentName" value={formState.parentName} onChange={handleChange} required />
            </label>
            <label className="form-field">
              <span>Mobile number</span>
              <input className="input-shell plain" name="mobileNumber" value={formState.mobileNumber} onChange={handleChange} required />
            </label>
            <label className="form-field">
              <span>Parent mobile number</span>
              <input className="input-shell plain" name="parentMobileNumber" value={formState.parentMobileNumber} onChange={handleChange} required />
            </label>
            <label className="form-field">
              <span>Annual income</span>
              <input className="input-shell plain" name="annualIncome" type="number" value={formState.annualIncome} onChange={handleChange} required />
            </label>
            <label className="form-field">
              <span>Profession</span>
              <input className="input-shell plain" name="profession" value={formState.profession} onChange={handleChange} required />
            </label>
            <label className="form-field">
              <span>Caste</span>
              <select className="select-shell" name="caste" value={formState.caste} onChange={handleChange}>
                {CASTES.filter((item) => item !== "All").map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Gender</span>
              <select className="select-shell" name="gender" value={formState.gender} onChange={handleChange}>
                {GENDERS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Religion</span>
              <select className="select-shell" name="religion" value={formState.religion} onChange={handleChange}>
                {RELIGIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>State</span>
              <select className="select-shell" name="state" value={formState.state} onChange={handleChange}>
                {STATES.filter((item) => item !== "All States").map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Area of residence</span>
              <select className="select-shell" name="areaOfResidence" value={formState.areaOfResidence} onChange={handleChange}>
                {["Urban", "Rural", "Both"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>10th marks</span>
              <input className="input-shell plain" name="tenthMarks" type="number" value={formState.tenthMarks} onChange={handleChange} required />
            </label>
            <label className="form-field">
              <span>12th marks</span>
              <input className="input-shell plain" name="twelfthMarks" type="number" value={formState.twelfthMarks} onChange={handleChange} required />
            </label>
            <label className="form-field">
              <span>College name</span>
              <input className="input-shell plain" name="collegeName" value={formState.collegeName} onChange={handleChange} required />
            </label>
            <label className="form-field">
              <span>Course name</span>
              <input className="input-shell plain" name="courseName" value={formState.courseName} onChange={handleChange} required />
            </label>
            <label className="form-field">
              <span>Current education level</span>
              <select className="select-shell" name="currentEducationLevel" value={formState.currentEducationLevel} onChange={handleChange}>
                {EDUCATION_LEVELS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Course type</span>
              <select className="select-shell" name="courseType" value={formState.courseType} onChange={handleChange}>
                {COURSE_TYPES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Year of study</span>
              <select className="select-shell" name="yearOfStudy" value={formState.yearOfStudy} onChange={handleChange}>
                {YEARS_OF_STUDY.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="form-field md:col-span-2">
              <span>Scholarship criteria or goals</span>
              <textarea
                className="textarea-shell"
                name="scholarshipCriteria"
                value={formState.scholarshipCriteria}
                onChange={handleChange}
                placeholder="Describe what matters most to you, such as support amount, category, or study type."
                required
              />
            </label>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["minorityStatus", "Minority status"],
              ["bplStatus", "BPL status"],
              ["singleParent", "Single parent"],
              ["disabledStatus", "Disability status"],
            ].map(([name, label]) => (
              <label key={name} className="checkbox-shell">
                <input type="checkbox" name={name} checked={formState[name]} onChange={handleChange} />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Checking eligibility..." : "Save and check eligibility"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
            <Link to="/user/scheme" className="secondary-button">
              Browse scholarships
            </Link>
          </div>
        </form>

        <aside className="sticky-panel space-y-6">
          <div className="section-card p-6">
            <div className="section-eyebrow">
              <Lightbulb className="h-4 w-4" />
              Result guide
            </div>
            <div className="mt-5 space-y-4">
              <div className="panel-soft p-4">
                <p className="text-sm font-extrabold text-[var(--ink)]">Eligible</p>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                  These scholarships passed the backend eligibility evaluation and are the strongest next options.
                </p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-sm font-extrabold text-[var(--ink)]">Near match</p>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                  These are promising opportunities that narrowly miss one or more conditions.
                </p>
              </div>
            </div>
          </div>

          <div className="section-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--primary-soft)] text-[var(--primary)]">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                  Student tip
                </p>
                <h3 className="text-lg font-extrabold text-[var(--ink)]">Keep your profile current</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
              Updating marks, income, and study level regularly will improve your recommendation quality.
            </p>
          </div>
        </aside>
      </section>

      <section className="page-section">
        <div className="mb-6">
          <div className="section-eyebrow">
            <BadgeCheck className="h-4 w-4" />
            Matched results
          </div>
          <h2 className="display-font mt-4 text-4xl font-bold tracking-[-0.05em] text-[var(--ink)]">
            Scholarships surfaced from your saved eligibility profile
          </h2>
        </div>

        <div className="grid gap-8">
          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="display-font text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                Eligible now
              </h3>
              <span className="rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-bold text-[var(--ink-soft)]">
                {eligibleSchemes.length} results
              </span>
            </div>

            {eligibleSchemes.length ? (
              <div className="scholarship-grid">
                {eligibleSchemes.map((item) => (
                  <article key={item._id} className="section-card card-hover flex h-full flex-col p-6">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--secondary)]">
                      {item.provider || item.category || "Scholarship"}
                    </p>
                    <h4 className="mt-3 text-[1.45rem] font-extrabold leading-tight text-[var(--ink)]">
                      {item.schemeName}
                    </h4>
                    <p className="mt-4 flex-1 text-sm leading-7 text-[var(--ink-soft)]">
                      {item.summary || item.benefits}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="status-chip is-success">Eligible</span>
                      {(item.tags || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Link to={`/user/scheme/${item._id}`} className="primary-button flex-1">
                        View details
                      </Link>
                      <a
                        href={item.applicationUrl || item.siteLink || item.detailsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="secondary-button flex-1"
                      >
                        Apply
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="section-card empty-state">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                  <SearchCheck className="h-7 w-7" />
                </div>
                <h3 className="display-font mt-5 text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                  Submit the form to see your best-fit scholarships
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                  Once your eligibility profile is saved, matching scholarships will appear here.
                </p>
              </div>
            )}
          </div>

          {!!nearMissSchemes.length && (
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="display-font text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                  Near matches worth reviewing
                </h3>
                <span className="rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-bold text-[var(--ink-soft)]">
                  {nearMissSchemes.length} results
                </span>
              </div>

              <div className="scholarship-grid">
                {nearMissSchemes.map((item) => (
                  <article key={item._id} className="section-card card-hover flex h-full flex-col p-6">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--secondary)]">
                      {item.provider || item.category || "Scholarship"}
                    </p>
                    <h4 className="mt-3 text-[1.45rem] font-extrabold leading-tight text-[var(--ink)]">
                      {item.schemeName}
                    </h4>
                    <p className="mt-4 flex-1 text-sm leading-7 text-[var(--ink-soft)]">
                      {item.summary || item.benefits}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="status-chip is-warning">Near match</span>
                      {(item.eligibility?.reasons || []).slice(0, 2).map((reason) => (
                        <span key={reason} className="tag-chip">
                          {reason}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link to={`/user/scheme/${item._id}`} className="secondary-button w-full">
                        Review details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ScholarshipForm;
