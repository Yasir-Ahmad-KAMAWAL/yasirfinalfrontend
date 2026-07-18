import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, FolderKanban, X } from "lucide-react";
import { createProjectApi } from "../api/project.api";
import { useProjects } from "../context/ProjectsContext";
import { useAuth } from "../context/AuthContext";
import UserPickerModal from "../components/UserPickerModal";

const BORDER_COLORS = [
  "border-l-blue-500 dark:border-l-blue-400",
  "border-l-emerald-500 dark:border-l-emerald-400",
  "border-l-orange-500 dark:border-l-orange-400",
  "border-l-purple-500 dark:border-l-purple-400",
  "border-l-teal-500 dark:border-l-teal-400",
  "border-l-rose-500 dark:border-l-rose-400",
  "border-l-salmon-500 dark:border-l-amber-400",
  "border-l-violet-500 dark:border-l-violet-400",
  "border-l-lime-500 dark:border-l-lime-400",
  "border-l-red-500 dark:border-l-red-400",
  "border-l-sky-500 dark:border-l-sky-400",
  "border-l-fuchsia-500 dark:border-l-fuchsia-400",
];

const getBorderColor = (id) => {
  if (!id) return BORDER_COLORS[0];
  let hash = 0;
  const idStr = id.toString();
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BORDER_COLORS[Math.abs(hash) % BORDER_COLORS.length];
};

const Projects = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { projects, loading, refreshProjects } = useProjects();
  const [showForm, setShowForm] = useState(searchParams.get("new") === "true");
  const [showLeadPicker, setShowLeadPicker] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isCompanyAdmin = user?.isCompanyAdmin;

  const getRoleLabel = (project) => {
    if (project.myRole === "admin") return "Company admin";
    if (project.myRole === "lead") return "You are lead";
    return "Member";
  };

  const getRoleBadgeClass = (project) => {
    if (project.myRole === "admin") {
      return "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400";
    }
    if (project.myRole === "lead") {
      return "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400";
    }
    return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }
    if (!selectedLead) {
      setError("Please choose a project lead.");
      return;
    }
    try {
      setSubmitting(true);
      await createProjectApi({
        name: form.name,
        description: form.description,
        leadUserId: selectedLead._id,
        memberUserIds: selectedMembers.map((m) => m._id),
      });
      setForm({ name: "", description: "" });
      setSelectedLead(null);
      setSelectedMembers([]);
      setShowForm(false);
      refreshProjects(); // updates both this page AND the sidebar immediately
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to create project. Only company admins can create projects."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Projects
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            All projects in your company
          </p>
        </div>
        {isCompanyAdmin && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {/* New project form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col gap-3"
        >
          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Project Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Client Billing Portal"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Description (optional)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={2}
              placeholder="What is this project about?"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-white/10 focus:border-blue-400 resize-none"
            />
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Team Members (optional)
            </label>
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedMembers.map((member) => (
                  <span
                    key={member._id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
                  >
                    {member.name}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedMembers((prev) =>
                          prev.filter((m) => m._id !== member._id)
                        )
                      }
                      className="hover:text-blue-900 dark:hover:text-blue-200 transition-colors"
                      aria-label={`Remove ${member.name}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowMemberPicker(true)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              {selectedMembers.length > 0
                ? "Add more members"
                : "Choose team members to add to this project"}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Project Lead
            </label>
            {selectedLead ? (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-white/10">
                <span className="text-sm text-slate-800 dark:text-slate-200">
                  {selectedLead.name} ({selectedLead.email})
                </span>
                <button
                  type="button"
                  onClick={() => setShowLeadPicker(true)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowLeadPicker(true)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm bg-white dark:bg-black text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Choose a company user to lead this project…
              </button>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
            >
              {submitting ? "Creating…" : "Create Project"}
            </button>
          </div>
        </form>
      )}

      {/* Projects list */}
      {loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderKanban size={40} className="text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No projects yet. Create your first one to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <button
              key={project._id}
              onClick={() => navigate(`/dashboard/projects/${project._id}`)}
              className={`text-left bg-white dark:bg-black border border-slate-200 dark:border-white/10 border-l-4 rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-200 ${getBorderColor(project._id)}`}
            >
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {project.description}
                </p>
              )}
              <div className="flex flex-col gap-1.5">
                {project.lead && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Lead: <span className="font-medium text-slate-700 dark:text-slate-300">{project.lead.name}</span>
                  </p>
                )}
                <span
                  className={`inline-block w-fit text-xs font-semibold px-2 py-1 rounded-full ${getRoleBadgeClass(project)}`}
                >
                  {getRoleLabel(project)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {showLeadPicker && (
        <UserPickerModal
          title="Choose a project lead"
          excludeIds={selectedMembers.map((m) => m._id)}
          onClose={() => setShowLeadPicker(false)}
          onSelect={(user) => {
            setSelectedLead(user);
            setShowLeadPicker(false);
          }}
        />
      )}

      {showMemberPicker && (
        <UserPickerModal
          title="Add team members"
          excludeIds={[selectedLead?._id, ...selectedMembers.map((m) => m._id)].filter(Boolean)}
          onClose={() => setShowMemberPicker(false)}
          onSelect={(user) => {
            setSelectedMembers((prev) => {
              if (prev.find((m) => m._id === user._id)) return prev;
              return [...prev, user];
            });
            // Keep modal open so they can keep adding
          }}
        />
      )}
    </div>
  );
};

export default Projects;