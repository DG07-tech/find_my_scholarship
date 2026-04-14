import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  BookOpenCheck,
  Clock3,
  FileText,
  Globe,
  IndianRupee,
  ListChecks,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../lib/api";

const formatAmount = (amount) =>
  amount ? `Rs. ${Number(amount).toLocaleString("en-IN")}` : "Not specified";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await api.get("/scholarships/all");
        setScholarships(response.data?.data || []);
      } catch {
        toast.error("Unable to load scholarship details.");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  const scholarship = useMemo(
    () => scholarships.find((item) => item._id === id),
    [id, scholarships]
  );

  const relatedScholarships = useMemo(() => {
    if (!scholarship) return [];
    return scholarships
      .filter((item) => item._id !== scholarship._id)
      .filter(
        (item) =>
          item.category === scholarship.category ||
          item.provider === scholarship.provider ||
          item.tags?.some((tag) => scholarship.tags?.includes(tag))
      )
      .slice(0, 3);
  }, [scholarship, scholarships]);

  if (loading) {
    return (
      <div className="page-shell pb-16 pt-5 md:pb-20">
        <div className="hero-card p-8 md:p-10">
          <div className="skeleton h-5 w-28 rounded-full" />
          <div className="skeleton mt-5 h-12 w-3/4 rounded-[1.5rem]" />
          <div className="skeleton mt-4 h-32 rounded-[1.8rem]" />
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="page-shell pb-16 pt-5 md:pb-20">
        <div className="section-card empty-state">
          <h1 className="display-font text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">
            Scholarship not found
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
            This scholarship may no longer be available or the link may be outdated.
          </p>
          <Link to="/user/scheme" className="primary-button mt-6">
            Back to scholarships
          </Link>
        </div>
      </div>
    );
  }

  const amount = scholarship.maxAnnualIncome || scholarship.annualIncome;
  const applicationLink = scholarship.applicationUrl || scholarship.siteLink || scholarship.detailsUrl;
  const keyFacts = [
    {
      label: "Support amount",
      value: formatAmount(amount),
      icon: IndianRupee,
    },
    {
      label: "Application mode",
      value: scholarship.applicationMode || "Online",
      icon: Clock3,
    },
    {
      label: "Region",
      value:
        scholarship.states?.includes("All")
          ? "Pan India"
          : scholarship.states?.join(", ") || scholarship.state || "Various states",
      icon: MapPin,
    },
    {
      label: "Verification",
      value: scholarship.sourceVerified ? "Official source verified" : "Review source link",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="page-shell pb-16 pt-5 md:pb-20">
      <section className="hero-card overflow-hidden px-6 py-8 md:px-8 md:py-10">
        <Link to="/user/scheme" className="secondary-button w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to scholarships
        </Link>

        <div className="two-column-layout mt-6">
          <div>
            <div className="section-eyebrow reveal-in">
              <Sparkles className="h-4 w-4" />
              Scholarship details
            </div>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--secondary)]">
              {scholarship.provider || scholarship.category || "Scholarship"}
            </p>
            <h1 className="section-heading mt-3 reveal-in delay-1">{scholarship.schemeName}</h1>
            <p className="section-subtitle mt-5 reveal-in delay-2">
              {scholarship.summary || scholarship.benefits}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {(scholarship.tags || scholarship.educationLevels || []).slice(0, 6).map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {keyFacts.map((fact) => (
                <article key={fact.label} className="info-card p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[var(--primary-soft)] text-[var(--primary)]">
                    <fact.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    {fact.label}
                  </p>
                  <p className="mt-2 text-sm font-bold leading-6 text-[var(--ink)]">{fact.value}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="sticky-panel">
            <div className="section-card p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="display-font text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                  Apply with confidence
                </h2>
                <span className={`status-chip ${scholarship.sourceVerified ? "is-success" : "is-warning"}`}>
                  {scholarship.sourceVerified ? "Verified" : "Check source"}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
                Review the summary, benefits, and requirements first, then continue through the official link.
              </p>

              <div className="mt-5 space-y-3">
                <a href={applicationLink} target="_blank" rel="noreferrer" className="primary-button w-full">
                  Apply now
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <Link to="/user/scholarships/check-eligibility" className="secondary-button w-full">
                  Check eligibility
                </Link>
                {(scholarship.detailsUrl || scholarship.schemeDocuments) && (
                  <a
                    href={scholarship.detailsUrl || scholarship.schemeDocuments}
                    target="_blank"
                    rel="noreferrer"
                    className="ghost-button w-full"
                  >
                    <FileText className="h-4 w-4" />
                    Official documents
                  </a>
                )}
              </div>

              <div className="panel-soft mt-5 p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                  Source highlight
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
                  <Globe className="h-4 w-4 text-[var(--primary)]" />
                  {scholarship.sourceName || scholarship.provider || "Official scholarship source"}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="page-section two-column-layout">
        <div className="space-y-6">
          <article className="section-card p-7">
            <div className="section-eyebrow">
              <BadgeCheck className="h-4 w-4" />
              Benefits
            </div>
            <p className="mt-5 text-sm leading-8 text-[var(--ink-soft)]">
              {scholarship.benefits || "Benefit information is available on the official scheme page."}
            </p>
          </article>

          <article className="section-card p-7">
            <div className="section-eyebrow">
              <ListChecks className="h-4 w-4" />
              Eligibility
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
              {(scholarship.eligibilitySummary?.length
                ? scholarship.eligibilitySummary
                : [
                  "Review academic, income, and category conditions on the official scheme page.",
                  "Check whether your state, gender, or course type is included.",
                  "Use the eligibility checker to compare this scheme against your saved profile.",
                ]
              ).map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>

          <article className="section-card p-7">
            <div className="section-eyebrow">
              <BookOpenCheck className="h-4 w-4" />
              Application process
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="panel-soft p-5">
                <h3 className="text-base font-extrabold text-[var(--ink)]">Before applying</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                  Confirm eligibility, required documents, and current scheme status before proceeding.
                </p>
              </div>
              <div className="panel-soft p-5">
                <h3 className="text-base font-extrabold text-[var(--ink)]">Best next step</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                  Compare this scholarship with your eligibility results to understand how strong a fit it is.
                </p>
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className="section-card p-7">
            <div className="section-eyebrow">
              <ShieldCheck className="h-4 w-4" />
              Important information
            </div>
            <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--ink-soft)]">
              <p>
                <strong className="text-[var(--ink)]">Category:</strong> {scholarship.category || "Government"}
              </p>
              <p>
                <strong className="text-[var(--ink)]">Education levels:</strong>{" "}
                {scholarship.educationLevels?.join(", ") || "See official notice"}
              </p>
              <p>
                <strong className="text-[var(--ink)]">Course types:</strong>{" "}
                {scholarship.courseTypes?.join(", ") || "General eligibility applies"}
              </p>
              <p>
                <strong className="text-[var(--ink)]">Supported categories:</strong>{" "}
                {scholarship.casteCategories?.join(", ") || scholarship.casteCategory || "All"}
              </p>
              <p>
                <strong className="text-[var(--ink)]">Religion:</strong>{" "}
                {scholarship.religions?.join(", ") || scholarship.religion || "All"}
              </p>
            </div>
          </article>

          <article className="section-card p-7">
            <div className="section-eyebrow">
              <FileText className="h-4 w-4" />
              Documents and links
            </div>
            <div className="mt-5 grid gap-3">
              {(scholarship.detailsUrl || scholarship.schemeDocuments) && (
                <a
                  href={scholarship.detailsUrl || scholarship.schemeDocuments}
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-button w-full justify-between"
                >
                  View official scheme details
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              {applicationLink && (
                <a
                  href={applicationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="primary-button w-full justify-between"
                >
                  Open application page
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </article>
        </div>
      </section>

      {!!relatedScholarships.length && (
        <section className="page-section">
          <div className="mb-8">
            <div className="section-eyebrow">
              <Sparkles className="h-4 w-4" />
              Related scholarships
            </div>
            <h2 className="display-font mt-4 text-4xl font-bold tracking-[-0.05em] text-[var(--ink)]">
              Similar options worth reviewing next
            </h2>
          </div>

          <div className="scholarship-grid">
            {relatedScholarships.map((item) => (
              <article key={item._id} className="section-card card-hover flex h-full flex-col p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--secondary)]">
                  {item.provider || item.category || "Scholarship"}
                </p>
                <h3 className="mt-3 text-[1.45rem] font-extrabold leading-tight text-[var(--ink)]">
                  {item.schemeName}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-[var(--ink-soft)]">
                  {item.summary || item.benefits}
                </p>
                <Link to={`/user/scheme/${item._id}`} className="primary-button mt-6">
                  View details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ScholarshipDetails;
