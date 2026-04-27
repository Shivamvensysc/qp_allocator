

import React, { useState, useEffect } from 'react';
import { User, Lock, Phone, UserPlus, CheckCircle2 } from 'lucide-react';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Types
interface Selector {
    id: number;
    username: string;
    mobileNumber: string;
}

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

    const fetchSelectors = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/users?type=selector`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data: Selector[] = await response.json();
                setSelectors(data);
            } else {
                console.error('Failed to fetch selectors:', response.statusText);
            }
        } catch (err) {
            console.error("Error fetching selectors:", err);
        }
    };

    useEffect(() => {
        fetchSelectors();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    type: 'selector'
                })
            });

            if (response.ok) {
                alert("Selector registered successfully!");
                setFormData({ username: '', password: '', mobileNumber: '' });
                setIsFormOpen(false);
                fetchSelectors();
            } else {
                const data = await response.json();
                alert(`Error: ${data.error || 'Failed to register selector'}`);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            alert("Failed to connect to server");
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

    return (
        <div className="max-w-7xl mx-auto  min-h-screen font-sans">
            <div className="mb-8 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#14223E] tracking-tight mb-2">
                        Selector Registration
                    </h1>
                    <p className="text-[15px] text-slate-600">
                        Add a new selector to the system with their credentials and contact information.
                    </p>
                </div>
                <button
                    onClick={handleCreateClick}
                    className="bg-[#0B1727] hover:bg-[#11213D] transition-colors text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md cursor-pointer flex items-center gap-2 whitespace-nowrap"
                >
                    <UserPlus className="w-4 h-4" />
                    {isFormOpen ? 'Close Form' : 'Create Selector'}
                </button>
            </div>

            {isFormOpen && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-blue-500" />
                                    Selector Details
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Username</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            autoComplete="off"
                                            className="bg-[#F8F9FA] border border-transparent rounded-xl px-4 py-3 pl-11 text-[14px] text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none w-full transition-all"
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
                                            className="bg-[#F8F9FA] border border-transparent rounded-xl px-4 py-3 pl-11 text-[14px] text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none w-full transition-all"
                                            placeholder="Enter secure password"
                                            required
                                        />
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1 ml-1">Must be at least 8 characters</p>
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
                                            className="bg-[#F8F9FA] border border-transparent rounded-xl px-4 py-3 pl-11 text-[14px] text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none w-full transition-all"
                                            placeholder="Enter mobile number"
                                            required
                                        />
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    </div>
                                </div>

                                <div className="pt-4 mt-8 lg:mt-auto border-t border-slate-100 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-[#0B1727] hover:bg-[#11213D] transition-colors text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                                    >
                                        Save Selector <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Registered Selectors Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                        <h2 className="text-lg font-bold text-slate-800">Active Selectors</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F9FA] text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th className="px-6 py-4">Selector Profile</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100">
                            {selectors.map((selector) => (
                                <tr key={selector.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {selector.username.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#14223E]">{selector.username}</div>
                                                <div className="text-[12px] text-slate-500">ID: USER-{selector.id}</div>
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
                                            <span className="text-xs font-semibold">Edit</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {selectors.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                                        No selectors registered yet.
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
