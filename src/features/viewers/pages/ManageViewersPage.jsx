import { useAuth } from "../../../context/AuthContext";
import AddViewerForm from "./Addviewerform";
import ViewerList from "./Viewerlist";
import useAddViewer from "../hooks/Useaddviewer";
import useViewers from "../hooks/Useviewers";

export default function ManageViewersPage() {
  const { user } = useAuth();

  const { viewers, setViewers, handleRemoveViewer } = useViewers(user);

  const onViewerAdded = (newViewer) => {
    setViewers((prev) => [...prev, newViewer]);
  };

  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleAddViewer,
  } = useAddViewer(user, onViewerAdded);

  return (
    <div className="my-4 space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="px-2">
        <h2 className="text-2xl font-bold text-text-main">Manage Viewers</h2>
        <p className="text-text-light text-sm mt-0.5">
          Add people who can view your transactions but cannot edit anything.
        </p>
      </div>

      <AddViewerForm
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        onSubmit={handleAddViewer}
      />

      <ViewerList viewers={viewers} onRemove={handleRemoveViewer} />
    </div>
  );
}
