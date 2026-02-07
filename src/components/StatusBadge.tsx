"use client";

import React from 'react';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Closed';

interface StatusBadgeProps {
    status: LeadStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles = {
        New: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        Contacted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        Qualified: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        Proposal: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        Closed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
            {status}
        </span>
    );
};
