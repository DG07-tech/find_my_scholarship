import { Eye, Search, Trash2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../lib/api";

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchStudents = async (page = pagination.page, search = searchTerm) => {
    try {
      setLoading(true);
      const response = await api.get("/admin/students", {
        params: {
          search,
          page,
          limit: 8,
        },
      });

      if (response.data?.success) {
        setStudents(response.data.data || []);
        setPagination(response.data.pagination || { page: 1, total: 0, pages: 0 });
      } else {
        toast.error("Failed to fetch students.");
      }
    } catch {
      toast.error("Error fetching students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchStudents(1, searchTerm);
      setPagination((current) => ({ ...current, page: 1 }));
    }, 250);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleDeleteStudent = async () => {
    if (!selectedStudent?._id) return;

    try {
      const response = await api.delete(`/admin/students/${selectedStudent._id}`);
      if (response.data?.success) {
        toast.success("Student deleted successfully.");
        setShowDeleteModal(false);
        setSelectedStudent(null);
        fetchStudents();
      }
    } catch {
      toast.error("Error deleting student.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="section-eyebrow">
            <UserRound className="h-4 w-4" />
            Registered students
          </div>
          <h2 className="display-font mt-4 text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">
            Student directory
          </h2>
        </div>

        <div className="input-shell max-w-[320px]">
          <Search className="h-5 w-5 text-[var(--ink-muted)]" />
          <input
            type="text"
            placeholder="Search by name, email, or college"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="table-shell">
        {loading ? (
          <div className="p-8 text-center text-sm font-semibold text-[var(--ink-soft)]">
            Loading students...
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>College</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>
                    <div>
                      <div className="font-bold text-[var(--ink)]">{student.fullName || student.username}</div>
                      <div className="text-sm text-[var(--ink-soft)]">{student.email}</div>
                    </div>
                  </td>
                  <td className="text-sm text-[var(--ink-soft)]">
                    {student.collegeName || "Not added"}
                  </td>
                  <td className="text-sm text-[var(--ink-soft)]">
                    {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowViewModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="icon-button !text-[var(--danger)]"
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="pagination-shell">
          <button
            type="button"
            className="secondary-button"
            disabled={pagination.page === 1}
            onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))}
          >
            Previous
          </button>
          <span className="split-badge text-sm font-bold text-[var(--ink-soft)]">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            type="button"
            className="secondary-button"
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}
          >
            Next
          </button>
        </div>
      )}

      {showViewModal && selectedStudent && (
        <div className="modal-backdrop">
          <div className="modal-card p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="display-font text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                Student details
              </h3>
              <button type="button" className="icon-button" onClick={() => setShowViewModal(false)}>
                <Trash2 className="h-4 w-4 rotate-45" />
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {[
                ["Full name", selectedStudent.fullName],
                ["Email", selectedStudent.email],
                ["Phone", selectedStudent.mobileNumber],
                ["Date of birth", selectedStudent.dateOfBirth],
                ["Parent name", selectedStudent.parentName],
                ["Parent phone", selectedStudent.parentMobileNumber],
                ["College", selectedStudent.collegeName],
                ["Course", selectedStudent.courseName],
                ["Year of study", selectedStudent.yearOfStudy],
                ["Annual income", selectedStudent.annualIncome],
                ["Caste", selectedStudent.caste],
                ["Religion", selectedStudent.religion],
                ["State", selectedStudent.state],
                ["Area of residence", selectedStudent.areaOfResidence],
              ].map(([label, value]) => (
                <div key={label} className="panel-soft p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{value || "Not added"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedStudent && (
        <div className="modal-backdrop">
          <div className="modal-card max-w-[520px] p-6 md:p-8">
            <h3 className="display-font text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
              Delete student
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
              Are you sure you want to delete {selectedStudent.fullName || selectedStudent.username}? This
              action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" className="secondary-button" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={handleDeleteStudent}>
                Delete student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsTable;
