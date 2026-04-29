import React, { useState, useEffect } from 'react';
import { User, Lock, Phone, UserPlus, CheckCircle2, Edit2, Users, X } from 'lucide-react';
import { fetchSelectors, registerSelector } from "../../../services/selector.Service";
import type { Selector } from "../../../services/selector.Service";

interface FormData {
    username: string;
    password: string;
    mobileNumber: string;
}

const AdminSelectorPage: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [selectors, setSelectors] = useState<Selector[]>([]);
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        mobileNumber: ''
    });

    const loadSelectors = async (): Promise<void> => {
        try {
            const data = await fetchSelectors();
            setSelectors(data);
        } catch (err) {
            console.error("Error fetching selectors:", err);
        }
    };

    useEffect(() => {
        loadSelectors();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        try {
            await registerSelector(formData);
            alert("Selector registered successfully!");
            setFormData({
                username: "",
                password: "",
                mobileNumber: "",
            });
            setIsFormOpen(false);
            loadSelectors();
        } catch (err: any) {
            console.error("Error submitting form:", err);
            alert(
                err?.response?.data?.error ||
                "Failed to register selector"
            );
        }
    };

    const handleCreateClick = (): void => {
        if (!isFormOpen) {
            setFormData({ username: '', password: '', mobileNumber: '' });
        }
        setIsFormOpen(!isFormOpen);
    };

    const handleEditClick = (data: FormData): void => {
        setFormData(data);
        setIsFormOpen(true);
    };

    const handleCloseForm = (): void => {
        setIsFormOpen(false);
        setFormData({ username: '', password: '', mobileNumber: '' });
    };

    return (
        <div className="max-w-7xl  mx-auto min-h-screen font-sans ">
            {isFormOpen && (
                <div className="grid grid-cols-1  gap-8 mb-4">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 relative overflow-hidden">
                            {/* Close Icon - Top Right */}
                            <button
                                onClick={handleCloseForm}
                                className="absolute top-4 right-4 bg-slate-100 border border-slate50 text-slate-600 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-blue-500" />
                                    Selector Details
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                {/* All input fields in one row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Username</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                autoComplete="off"
                                                className="bg-[#F8F9FA] border border-slate-300  rounded-xl px-4 py-3 pl-11 text-[14px] text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none w-full transition-all"
                                                placeholder="Enter unique username"
                                                required
                                            />
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                autoComplete="new-password"
                                                className="bg-[#F8F9FA] border border-slate-300 rounded-xl px-4 py-3 pl-11 text-[14px] text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none w-full transition-all"
                                                placeholder="Enter secure password"
                                                required
                                            />
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        </div>
                                        
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Mobile Number</label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="mobileNumber"
                                                value={formData.mobileNumber}
                                                onChange={handleChange}
                                                autoComplete="off"
                                                className="bg-[#F8F9FA] border border-slate-300 rounded-xl px-4 py-3 pl-11 text-[14px] text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none w-full transition-all"
                                                placeholder="Enter mobile number"
                                                required
                                            />
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons Section */}
                                <div className="pt-2 border-t border-slate-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseForm}
                                        className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-semibold text-sm px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#0B1727] hover:bg-[#11213D] transition-colors text-white font-semibold text-sm px-8 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                                    >
                                        Save Selector <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Registered Selectors Section - Wrapped in Border with Header */}
            <div className="bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                            <Users className="w-5 h-5 text-emerald-600" />
                            <h2 className="text-lg font-bold text-slate-800">Active Selectors</h2>
                          
                        </div>
                        <button
                            onClick={handleCreateClick}
                            className="bg-[#0B1727] hover:bg-[#11213D] transition-colors text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-2 whitespace-nowrap"
                        >
                            <UserPlus className="w-4 h-4" />
                            {isFormOpen ? 'Close Form' : 'Create Selector'}
                        </button>
                    </div>
                    <p className="text-[13px] text-slate-500  ml-4">
                        Manage and view all registered selectors in the system
                    </p>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F9FA] text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <th className="px-6 py-4">Selector Profile</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-200">
                            {selectors.map((selector) => (
                                <tr key={selector.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm">
                                                {selector.username.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#14223E]">{selector.username}</div>
                                                {/* <div className="text-[12px] text-slate-500">ID: {selector.id}</div> */}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                                            {selector.mobileNumber}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            Active
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEditClick({ 
                                                username: selector.username, 
                                                password: '', 
                                                mobileNumber: selector.mobileNumber 
                                            })}
                                            className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                  </tr>
                            ))}
                            {selectors.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <UserPlus className="w-12 h-12 text-slate-300" />
                                            <p>No selectors registered yet.</p>
                                            <p className="text-xs">Click "Create Selector" to add one</p>
                                        </div>
                                    </td>
                                  </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminSelectorPage;