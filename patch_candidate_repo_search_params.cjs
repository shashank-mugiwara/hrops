const fs = require('fs');

let file = fs.readFileSync('src/pages/CandidateRepository.tsx', 'utf8');

file = file.replace(/const \[searchParams\] = useSearchParams\(\);/, 'const [searchParams, setSearchParams] = useSearchParams();');

fs.writeFileSync('src/pages/CandidateRepository.tsx', file);
