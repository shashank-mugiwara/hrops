import React, { useState, useEffect } from 'react';
import { api, type Candidate, type Group } from '../api';

interface EditCandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: Candidate;
    onCandidateUpdated: (candidate: Candidate) => void;
}

const EditCandidateModal: React.FC<EditCandidateModalProps> = ({
    isOpen,
    onClose,
    candidate,
    onCandidateUpdated
}) => {
    const [formData, setFormData] = useState<Partial<Candidate>>({});
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingGroups, setFetchingGroups] = useState(false);
    const [error, setError] = useState('');

    // Initialize form
    useEffect(() => {
        if (isOpen && candidate) {
            setFormData({
                candidate_name: candidate.candidate_name,
                candidate_email: candidate.candidate_email,
                role: candidate.role || '',
                status: candidate.status,
                group_id: candidate.group_id,
                location: candidate.location || '',
                joining_date: candidate.joining_date || '',
                reporting_manager_name: candidate.reporting_manager_name || ''
            });
            setError('');
        }
    }, [isOpen, candidate]);

    // Fetch groups
    useEffect(() => {
        if (isOpen && groups.length === 0) {
            setFetchingGroups(true);
            api.groups.list()
                .then(setGroups)
                .catch(err => console.error("Could not fetch groups", err))
                .finally(() => setFetchingGroups(false));
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'group_id' ? (value ? parseInt(value) : undefined) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            const updated = await api.candidates.update(candidate.id, formData);
            onCandidateUpdated(updated);
            onClose();
        } catch (err) {
            setError((err instanceof Error ? err.message : String(err)) || 'Failed to update candidate');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Overlay */}
            <div className="absolute inset-0 bg-[#0f0f23]/70 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Edit Profile</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Update candidate information and assignments.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" aria-label="Close modal">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-100 text-sm">{error}</div>}

                    <form id="edit-candidate-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                                <input
                                    name="candidate_name"
                                    value={formData.candidate_name || ''}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                                <input
                                    type="email"
                                    name="candidate_email"
                                    value={formData.candidate_email || ''}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Role</label>
                                <input
                                    name="role"
                                    value={formData.role || ''}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
                                <select
                                    name="status"
                                    value={formData.status || ''}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white"
                                >
                                    <option value="New">New</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Review Needed">Review Needed</option>
                                    <option value="Pending Invite">Pending Invite</option>
                                    <option value="Docs Signed">Docs Signed</option>
                                    <option value="Pre-boarding">Pre-boarding</option>
                                    <option value="Active">Active</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Group Assignment</label>
                                <select
                                    name="group_id"
                                    value={formData.group_id || ''}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white"
                                    disabled={fetchingGroups}
                                >
                                    <option value="">No Group</option>
                                    {groups.map(g => (
                                        <option key={g.id} value={g.id}>{g.name} (GRP-{g.id})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Location</label>
                                <input
                                    name="location"
                                    value={formData.location || ''}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Joining Date</label>
                                <input
                                    type="date"
                                    name="joining_date"
                                    value={formData.joining_date || ''}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Reporting Manager</label>
                                <input
                                    name="reporting_manager_name"
                                    value={formData.reporting_manager_name || ''}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex justify-end items-center gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-candidate-form"
                        disabled={loading}
                        className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded shadow-lg shadow-primary/20 transition-all flex items-center"
                    >
                        <span className="material-symbols-outlined mr-2 text-[18px]">save</span>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCandidateModal;
