import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Structures = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate("/dashboard/all-issues")}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mb-4"
      >
        <ArrowLeft size={14} />
        Back to Issues
      </button>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Structures
      </h1>

      <div className="space-y-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <p>
          In project management, structures refer to the organizational framework that defines how
          tasks, resources, and responsibilities are arranged to achieve project goals. A well-defined
          project structure ensures clarity in reporting lines, decision-making authority, and
          communication channels across the team. Common structural models include functional
          structures, matrix structures, and project-based structures, each offering distinct advantages
          depending on the scale and complexity of the initiative.
        </p>

        <p>
          The Work Breakdown Structure (WBS) is one of the most fundamental tools in project
          structuring. It decomposes the overall project into smaller, manageable components or work
          packages, making it easier to estimate costs, assign responsibilities, and track progress.
          By breaking down deliverables hierarchically, teams can identify dependencies, mitigate
          risks early, and ensure that no critical task is overlooked during execution.
        </p>

        <p>
          Beyond the WBS, organizational breakdown structures (OBS) and resource breakdown structures
          (RBS) further enhance project clarity. The OBS maps tasks to specific teams or individuals,
          while the RBS categorizes resources such as personnel, equipment, and materials. Together,
          these structural frameworks form the backbone of effective project planning, enabling
          stakeholders to maintain control over scope, budget, and timeline throughout the project
          lifecycle.
        </p>
      </div>
    </div>
  );
};

export default Structures;