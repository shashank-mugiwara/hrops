const fs = require('fs');

let file = fs.readFileSync('src/pages/CandidateRepository.tsx', 'utf8');

const importReplacement = `import React, { useState, useEffect, useRef } from 'react';\nimport { Link, useSearchParams } from 'react-router-dom';\nimport { MainLayout } from '../layouts/MainLayout';\nimport { clsx } from 'clsx';\nimport { api, type Candidate, type Group } from '../api';`;

file = file.replace(/import React, { useState, useEffect } from 'react';\nimport { Link, useSearchParams } from 'react-router-dom';\nimport { MainLayout } from '\.\.\/layouts\/MainLayout';\nimport { clsx } from 'clsx';\nimport { api, type Candidate } from '\.\.\/api';/, importReplacement);

const stateAdditions = `
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [groups, setGroups] = useState<Group[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await api.groups.list();
        setGroups(data);
      } catch(err) {
        console.error("Failed to load groups");
      }
    }
    fetchGroups();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFilterCount = (filterGroupId ? 1 : 0) + (filterStatus ? 1 : 0) + (filterLocation ? 1 : 0);

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFilterStatus('');
    setFilterLocation('');
    searchParams.delete('group_id');
    setSearchParams(searchParams);
  };
`;

file = file.replace(/const \[searchParams, setSearchParams\] = useSearchParams\(\);\n  const filterGroupId = searchParams\.get\('group_id'\);/, `const [searchParams, setSearchParams] = useSearchParams();\n  const filterGroupId = searchParams.get('group_id');\n${stateAdditions}`);

const filterLogic = `
  const filteredCandidates = candidates.filter(c =>
    (!filterGroupId || c.group_id?.toString() === filterGroupId) &&
    (!filterStatus || c.status === filterStatus) &&
    (!filterLocation || c.location?.toLowerCase() === filterLocation.toLowerCase()) &&
    ((c.candidate_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.candidate_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.role || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );
`;

file = file.replace(/const filteredCandidates = candidates\.filter\(c =>[\s\S]*?\n  \);/, filterLogic);

fs.writeFileSync('src/pages/CandidateRepository.tsx', file);
