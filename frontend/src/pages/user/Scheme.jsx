import {
  ArrowRight,
  Bookmark,
  Clock3,
  Filter,
  Globe,
  GraduationCap,
  IndianRupee,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { CASTES, EDUCATION_LEVELS, GENDERS, STATES } from "../../lib/options";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "amountHigh", label: "Amount: High to low" },
  { value: "nameAsc", label: "Name: A to Z" },
];

const categoryChipSet = ["Government", "Merit", "Need Based", "Girls", "Technical"];
const pageSize = 6;

const formatAmount = (amount) =>
  amount ? `Rs. ${Number(amount).toLocaleString("en-IN")}` : "Not specified";

const Scheme = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    state: "All States",
    caste: "All",
    gender: "All",
    level: "All",
    category: "All",
  });

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await api.get("/scholarships/all");
        setScholarships(response.data?.data || []);
      } catch {
        toast.error("Failed to fetch scholarships.");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }
    setSearchParams(params, { replace: true });
    setCurrentPage(1);
  }, [searchParams, searchTerm, setSearchParams]);

  const filteredScholarships = useMemo(() => {
    const filtered = scholarships.filter((scholarship) => {
      const haystack = [
        scholarship.schemeName,
        scholarship.provider,
        scholarship.category,
        scholarship.summary,
        scholarship.benefits,
        ...(scholarship.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchTerm.trim() || haystack.includes(searchTerm.trim().toLowerCase());
      const matchesState =
        filters.state === "All States" ||
        scholarship.states?.includes("All") ||
        scholarship.states?.includes(filters.state) ||
        scholarship.state === filters.state;
      const matchesCaste =
        filters.caste === "All" ||
        scholarship.casteCategories?.includes("All") ||
        scholarship.casteCategories?.includes(filters.caste) ||
        scholarship.casteCategory === filters.caste;
      const matchesGender =
        filters.gender === "All" ||
        scholarship.genders?.includes("All") ||
        scholarship.genders?.includes(filters.gender) ||
        scholarship.gender === "Both" ||
        scholarship.gender === filters.gender;
      const matchesLevel =
        filters.level === "All" ||
        scholarship.educationLevels?.includes("All") ||
        scholarship.educationLevels?.includes(filters.level);
      const matchesCategory =
        filters.category === "All" ||
        scholarship.category?.toLowerCase().includes(filters.category.toLowerCase()) ||
        scholarship.tags?.some((tag) =>
          tag.toLowerCase().includes(filters.category.toLowerCase())
        );

      return (
        matchesSearch &&
        matchesState &&
        matchesCaste &&
        matchesGender &&
        matchesLevel &&
        matchesCategory
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "amountHigh") {
        return (b.maxAnnualIncome || b.annualIncome || 0) - (a.maxAnnualIncome || a.annualIncome || 0);
      }

      if (sortBy === "nameAsc") {
        return a.schemeName.localeCompare(b.schemeName);
      }

      return Number(b.sourceVerified || 0) - Number(a.sourceVerified || 0);
    });
  }, [filters, scholarships, searchTerm, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredScholarships.length / pageSize));
  const paginatedScholarships = filteredScholarships.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSaved = (id) => {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      state: "All States",
      caste: "All",
      gender: "All",
      level: "All",
      category: "All",
    });
    setSortBy("recommended");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="page-shell pb-16 pt-5 md:pb-20">
      <section className="hero-card overflow-hidden px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <div className="section-eyebrow reveal-in">
                <Sparkles className="h-4 w-4" />
                Scholarship explorer
              </div>
              <h1 className="section-heading mt-5 reveal-in delay-1">
                Search, filter, sort, and compare scholarships in a world-class browsing experience.
              </h1>
              <p className="section-subtitle mt-5 reveal-in delay-2">
                Designed for better readability, cleaner scholarship cards, richer metadata, and a
                responsive layout that still preserves the platform's existing data flow.
              </p>
            </div>

            <div className="split-badge w-fit text-sm font-extrabold text-[var(--primary)]">
              <GraduationCap className="h-4 w-4" />
              {filteredScholarships.length} scholarships available
            </div>
          </div>

          <div className="section-card rounded-[1.9rem] p-5 md:p-6">
            <div className="filter-grid">
              <label className="form-field">
                <span>Search</span>
                <div className="input-shell">
                  <Search className="h-5 w-5 text-[var(--ink-muted)]" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by scholarship, provider, benefit, or keyword"
                  />
                </div>
              </label>

              <label className="form-field">
                <span>State</span>
                <select
                  value={filters.state}
                  onChange={(event) => updateFilter("state", event.target.value)}
                  className="select-shell"
                >
                  {STATES.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Category</span>
                <select
                  value={filters.caste}
                  onChange={(event) => updateFilter("caste", event.target.value)}
                  className="select-shell"
                >
                  {CASTES.map((caste) => (
                    <option key={caste}>{caste}</option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Gender</span>
                <select
                  value={filters.gender}
                  onChange={(event) => updateFilter("gender", event.target.value)}
                  className="select-shell"
                >
                  {["All", ...GENDERS].map((gender) => (
                    <option key={gender}>{gender}</option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Study level</span>
                <select
                  value={filters.level}
                  onChange={(event) => updateFilter("level", event.target.value)}
                  className="select-shell"
                >
                  {["All", ...EDUCATION_LEVELS].map((level) => (
                    <option key={level}>{level}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-2">
                {["All", ...categoryChipSet].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => updateFilter("category", chip)}
                    className={`pill-chip transition ${filters.category === chip
                        ? "border-[var(--line-strong)] bg-[var(--primary-soft)] text-[var(--primary)]"
                        : ""
                      }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="split-badge text-sm font-bold text-[var(--ink-soft)]">
                  <SlidersHorizontal className="h-4 w-4 text-[var(--primary)]" />
                  Refined filters
                </div>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="select-shell min-w-[220px]"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button type="button" className="secondary-button" onClick={clearFilters}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        {loading ? (
          <div className="scholarship-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="section-card p-6">
                <div className="skeleton h-5 w-28 rounded-full" />
                <div className="skeleton mt-4 h-8 w-4/5 rounded-2xl" />
                <div className="skeleton mt-4 h-24 rounded-[1.4rem]" />
                <div className="skeleton mt-5 h-16 rounded-[1.2rem]" />
                <div className="skeleton mt-5 h-12 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredScholarships.length ? (
          <>
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="display-font text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                  Matching scholarships
                </h2>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">
                  Compare scholarships by benefit, eligibility fit, geography, and official source quality.
                </p>
              </div>
              <div className="split-badge text-sm font-bold text-[var(--ink-soft)]">
                <Filter className="h-4 w-4 text-[var(--primary)]" />
                Page {currentPage} of {totalPages}
              </div>
            </div>

            <div className="scholarship-grid">
              {paginatedScholarships.map((scholarship, index) => {
                const amount = scholarship.maxAnnualIncome || scholarship.annualIncome;
                const locationLabel =
                  scholarship.states?.includes("All")
                    ? "Pan India"
                    : scholarship.states?.slice(0, 2).join(", ") || scholarship.state || "Various states";

                return (
                  <article
                    key={scholarship._id}
                    className={`section-card card-hover reveal-in delay-${(index % 4) + 1} flex h-full flex-col p-6`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--secondary)]">
                          {scholarship.provider || scholarship.category || "Scholarship"}
                        </p>
                        <h3 className="mt-3 text-[1.55rem] font-extrabold leading-tight text-[var(--ink)]">
                          {scholarship.schemeName}
                        </h3>
                      </div>
                      <button
                        type="button"
                        className={`icon-button shrink-0 ${savedIds.has(scholarship._id)
                            ? "border-[var(--line-strong)] bg-[var(--primary-soft)] text-[var(--primary)]"
                            : ""
                          }`}
                        onClick={() => toggleSaved(scholarship._id)}
                        aria-label="Save scholarship"
                      >
                        <Bookmark
                          className={`h-4 w-4 ${savedIds.has(scholarship._id) ? "fill-current" : ""}`}
                        />
                      </button>
                    </div>

                    <p className="mt-4 flex-1 text-sm leading-7 text-[var(--ink-soft)]">
                      {scholarship.summary || scholarship.benefits}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {(scholarship.tags || scholarship.educationLevels || []).slice(0, 4).map((tag) => (
                        <span key={tag} className="tag-chip">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="info-card p-4">
                          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                            Support amount
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-base font-extrabold text-[var(--ink)]">
                            <IndianRupee className="h-4 w-4 text-[var(--primary)]" />
                            {formatAmount(amount)}
                          </div>
                        </div>
                        <div className="info-card p-4">
                          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                            Region
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
                            <Globe className="h-4 w-4 text-[var(--primary)]" />
                            {locationLabel}
                          </div>
                        </div>
                      </div>

                      <div className="panel-soft p-4">
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                          Eligibility snapshot
                        </p>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--ink-soft)]">
                          {(scholarship.eligibilitySummary?.length
                            ? scholarship.eligibilitySummary
                            : ["Check scholarship details for eligibility requirements."])
                            .slice(0, 3)
                            .map((item) => (
                              <li key={item}>- {item}</li>
                            ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--ink-soft)]">
                        <span className="pill-chip">
                          <Clock3 className="h-3.5 w-3.5" />
                          {scholarship.applicationMode || "Online"}
                        </span>
                        <span className={`status-chip ${scholarship.sourceVerified ? "is-success" : "is-warning"}`}>
                          {scholarship.sourceVerified ? "Verified" : "Check source"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Link to={`/user/scheme/${scholarship._id}`} className="primary-button flex-1">
                        View details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a
                        href={scholarship.applicationUrl || scholarship.siteLink || scholarship.detailsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="secondary-button flex-1"
                      >
                        Apply
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="pagination-shell mt-8">
              <button
                type="button"
                className="secondary-button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                const active = pageNumber === currentPage;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    className={active ? "primary-button" : "ghost-button"}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                type="button"
                className="secondary-button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="section-card empty-state">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
              <Search className="h-7 w-7" />
            </div>
            <h2 className="display-font mt-5 text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">
              No scholarships matched these filters
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--ink-soft)]">
              Try broadening the search, state, category, or study level filters. You can also reset
              everything and explore the full directory again.
            </p>
            <button type="button" className="primary-button mt-6" onClick={clearFilters}>
              Reset filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Scheme;
