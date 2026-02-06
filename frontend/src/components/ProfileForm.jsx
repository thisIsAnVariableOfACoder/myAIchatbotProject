import { useEffect, useState } from 'react';

export default function ProfileForm({
  onSave,
  onUserTypeChange,
  canSave = false,
  storageKey = 'profileDraft',
  initialValues = null
}) {
  const [educationLevel, setEducationLevel] = useState('');
  const [currentGrade, setCurrentGrade] = useState('');
  const [workYears, setWorkYears] = useState('');
  const [workStyle, setWorkStyle] = useState('hybrid');
  const [hydrated, setHydrated] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setHydrated(false);
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      setHasDraft(false);
      setHydrated(true);
      setDirty(false);
      return;
    }
    try {
      const data = JSON.parse(saved);
      setEducationLevel(data.educationLevel || '');
      setCurrentGrade(data.currentGrade || '');
      setWorkYears(data.workYears || '');
      setWorkStyle(data.workStyle || 'hybrid');
      setHasDraft(true);
    } catch {
      setHasDraft(false);
    }
    setHydrated(true);
    setDirty(false);
  }, [storageKey]);

  useEffect(() => {
    if (!initialValues || hasDraft) return;
    setEducationLevel(initialValues.education_level || '');
    setCurrentGrade(initialValues.current_grade ? String(initialValues.current_grade) : '');
    setWorkYears(initialValues.work_experience_years ? String(initialValues.work_experience_years) : '');
    setWorkStyle(initialValues.preferred_work_style || 'hybrid');
    setDirty(false);
  }, [initialValues, hasDraft]);

  useEffect(() => {
    if (!hydrated) return;
    const payload = {
      educationLevel,
      currentGrade,
      workYears,
      workStyle
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [educationLevel, currentGrade, workYears, workStyle, storageKey, hydrated]);

  function markDirty(setter) {
    return (e) => {
      setter(e.target.value);
      setDirty(true);
    };
  }

  function handleUserTypeChange(e) {
    const value = e.target.value;
    setEducationLevel(value);
    setDirty(true);
    if (onUserTypeChange && value) {
      onUserTypeChange(value === 'professional' ? 'professional' : value);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSave) return;
    onSave({
      skills: [],
      interests: [],
      education_level: educationLevel,
      current_grade: Number(currentGrade) || null,
      work_experience_years: Number(workYears) || null,
      preferred_work_style: workStyle
    });
    if (onUserTypeChange && educationLevel) {
      onUserTypeChange(educationLevel === 'professional' ? 'professional' : educationLevel);
    }
    setDirty(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-[#5B5B57]" htmlFor="education">Nhóm người dùng</label>
        <select
          id="education"
          value={educationLevel}
          onChange={handleUserTypeChange}
          className="mt-1 w-full rounded-lg border border-[#E2D8C8] px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-[var(--c-accent)] focus:outline-none"
        >
          <option value="">Chọn nhóm người dùng</option>
          <option value="high_school">Học sinh</option>
          <option value="university">Sinh viên</option>
          <option value="professional">Đi làm / Chuyển nghề</option>
        </select>
      </div>

      {(educationLevel === 'high_school' || educationLevel === 'university') && (
        <div>
          <label className="text-xs text-[#5B5B57]" htmlFor="grade">
            {educationLevel === 'high_school' ? 'Lớp hiện tại' : 'Sinh viên năm mấy'}
          </label>
          <input
            id="grade"
            value={currentGrade}
            onChange={markDirty(setCurrentGrade)}
            className="mt-1 w-full rounded-lg border border-[#E2D8C8] px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-[var(--c-accent)] focus:outline-none"
            placeholder={educationLevel === 'high_school' ? 'Nhập lớp hiện tại' : 'Nhập năm học'}
          />
        </div>
      )}

      {educationLevel === 'professional' && (
        <>
          <div>
            <label className="text-xs text-[#5B5B57]" htmlFor="work">Năm kinh nghiệm</label>
            <input
              id="work"
              value={workYears}
              onChange={markDirty(setWorkYears)}
              className="mt-1 w-full rounded-lg border border-[#E2D8C8] px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-[var(--c-accent)] focus:outline-none"
              placeholder="Nhập số năm"
            />
          </div>
          <div>
            <label className="text-xs text-[#5B5B57]" htmlFor="style">Phong cách làm việc</label>
            <select
              id="style"
              value={workStyle}
              onChange={markDirty(setWorkStyle)}
              className="mt-1 w-full rounded-lg border border-[#E2D8C8] px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-[var(--c-accent)] focus:outline-none"
            >
              <option value="remote">Remote</option>
              <option value="office">Office</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </>
      )}

      <button className="w-full rounded-lg bg-[var(--c-primary)] py-2 text-white hover:opacity-90 transition disabled:opacity-50 active:scale-[0.98]" type="submit" disabled={!canSave}>
        Lưu hồ sơ
      </button>
      {dirty && (
        <div className="text-xs text-[#D64545] whitespace-nowrap">Hãy lưu hồ sơ để áp dụng thay đổi</div>
      )}
    </form>
  );
}
