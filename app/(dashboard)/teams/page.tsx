"use client";

import { TopBar } from "@/components/layout/TopBar";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Plus, Users, X, UserPlus, Trash2 } from "lucide-react";

export default function TeamsPage() {
  const teams = useQuery(api.teams.list);
  const createTeam = useMutation(api.teams.create);
  const addMember = useMutation(api.teams.addMember);
  const removeMember = useMutation(api.teams.removeMember);
  const removeTeam = useMutation(api.teams.remove);
  const [showCreate, setShowCreate] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [addingTo, setAddingTo] = useState<string | null>(null);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;
    await createTeam({ name: newTeamName.trim(), memberEmails: [] });
    setNewTeamName("");
    setShowCreate(false);
  };

  const handleAddMember = async (teamId: string) => {
    if (!newMemberEmail.trim()) return;
    await addMember({ teamId: teamId as never, email: newMemberEmail.trim() });
    setNewMemberEmail("");
    setAddingTo(null);
  };

  return (
    <>
      <TopBar title="Teams" />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-grey-3">
            Manage your teams and send documents to multiple people.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-pign-black text-white text-sm px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            Create team
          </button>
        </div>

        {showCreate && (
          <div className="bg-white rounded-xl border border-grey-6 p-4 mb-4">
            <h3 className="text-sm font-medium mb-3">New Team</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.currentTarget.value)}
                placeholder="Team name"
                className="flex-1 border border-grey-5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pign-black"
                onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
                autoFocus
              />
              <button
                onClick={handleCreateTeam}
                className="bg-pign-black text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="text-grey-3 text-sm px-3 py-2 hover:text-pign-black transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {teams === undefined ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-grey-5 border-t-pign-black rounded-full animate-spin" />
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users size={48} className="text-grey-5 mb-4" />
            <h3 className="text-lg font-medium text-pign-black mb-1">
              No teams yet
            </h3>
            <p className="text-sm text-grey-3">
              Create a team to send documents to multiple people.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-xl border border-grey-6 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-grey-3" />
                    <h3 className="text-sm font-medium">{team.name}</h3>
                    <span className="text-xs text-grey-4">
                      {team.memberEmails.length} members
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setAddingTo(addingTo === team._id ? null : team._id)
                      }
                      className="w-7 h-7 rounded flex items-center justify-center hover:bg-grey-7 transition-colors"
                    >
                      <UserPlus size={14} className="text-grey-3" />
                    </button>
                    <button
                      onClick={() => removeTeam({ id: team._id })}
                      className="w-7 h-7 rounded flex items-center justify-center hover:bg-grey-7 transition-colors"
                    >
                      <Trash2 size={14} className="text-grey-3" />
                    </button>
                  </div>
                </div>

                {addingTo === team._id && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.currentTarget.value)}
                      placeholder="Member email"
                      className="flex-1 border border-grey-5 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-pign-black"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddMember(team._id)
                      }
                      autoFocus
                    />
                    <button
                      onClick={() => handleAddMember(team._id)}
                      className="bg-pign-black text-white text-xs px-3 py-1.5 rounded-lg hover:opacity-90"
                    >
                      Add
                    </button>
                  </div>
                )}

                {team.memberEmails.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {team.memberEmails.map((email) => (
                      <span
                        key={email}
                        className="flex items-center gap-1 bg-grey-7 text-xs text-grey-2 px-2.5 py-1 rounded-full"
                      >
                        {email}
                        <button
                          onClick={() =>
                            removeMember({ teamId: team._id, email })
                          }
                        >
                          <X size={10} className="text-grey-4 hover:text-pign-black" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
