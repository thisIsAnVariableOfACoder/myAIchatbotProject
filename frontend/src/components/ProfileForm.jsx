import { useEffect, useState } from 'react';

function toNullableNumber(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

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
    if (canSave) return;
    setEducationLevel('');
    setCurrentGrade('');
    setWorkYears('');
    setWorkStyle('hybrid');
    setDirty(false);
  }, [canSave]);

  useEffect(() => {
    setHydrated(false);

    if (!canSave) {
      setHasDraft(false);
      setHydrated(true);
      setDirty(false);
      return;
    }

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
  }, [storageKey, canSave]);

  useEffect(() => {
    if (!initialValues || hasDraft) return;
    setEducationLevel(initialValues.education_level || '');
    setCurrentGrade(
      initialValues.current_grade !== null && initialValues.current_grade !== undefined
        ? String(initialValues.current_grade)
        : ''
    );
    setWorkYears(
      initialValues.work_experience_years !== null && initialValues.work_experience_years !== undefined
        ? String(initialValues.work_experience_years)
        : ''
    );
    setWorkStyle(initialValues.preferred_work_style || 'hybrid');
    setDirty(false);
  }, [initialValues, hasDraft]);

  useEffect(() => {
    if (!hydrated) return;
    if (!canSave) return;
    const payload = {
      educationLevel,
      currentGrade,
      workYears,
      workStyle
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [educationLevel, currentGrade, workYears, workStyle, storageKey, hydrated, canSave]);

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
    const parsedCurrentGrade = toNullableNumber(currentGrade);
    const parsedWorkYears = toNullableNumber(workYears);

    onSave({
      skills: [],
      interests: [],
      education_level: educationLevel,
      current_grade: parsedCurrentGrade,
      work_experience_years: parsedWorkYears,
      preferred_work_style: workStyle
    });
    if (onUserTypeChange && educationLevel) {
      onUserTypeChange(educationLevel === 'professional' ? 'professional' : educationLevel);
    }
    setDirty(false);
  }

  const isValid = () => {
    if (!educationLevel) return true; // Allow saving empty to clear profile
    if (educationLevel === 'high_school' || educationLevel === 'university') {
      return !!currentGrade;
    }
    if (educationLevel === 'professional') {
      return !!workYears;
    }
    return false;
  };

  const isFormValid = isValid();

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-[#5B5B57]" htmlFor="education">Nhóm người dùng</label>
        <select
          id="education"
          value={educationLevel}
          onChange={handleUserTypeChange}
          className="input-elevated mt-1 w-full px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-[var(--c-accent)] focus:outline-none"
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
            className="input-elevated mt-1 w-full px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-[var(--c-accent)] focus:outline-none"
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
              className="input-elevated mt-1 w-full px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-[var(--c-accent)] focus:outline-none"
              placeholder="Nhập số năm"
            />
          </div>
          <div>
            <label className="text-xs text-[#5B5B57]" htmlFor="style">Phong cách làm việc</label>
            <select
              id="style"
              value={workStyle}
              onChange={markDirty(setWorkStyle)}
              className="input-elevated mt-1 w-full px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-[var(--c-accent)] focus:outline-none"
            >
              <option value="remote">Remote</option>
              <option value="office">Office</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </>
      )}

      <button
        className="btn-primary w-full py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        type="submit"
        disabled={!canSave || !isFormValid}
      >
        {canSave ? (educationLevel ? "Lưu hồ sơ" : "Xóa hồ sơ & Chat") : "Đăng nhập để lưu hồ sơ"}
      </button>
      {!canSave && (
        <div className="text-xs text-[#5B5B57]">Vui lòng đăng nhập trước khi lưu hồ sơ để bắt đầu chat.</div>
      )}
      {dirty && isFormValid && (
        <div className="text-xs text-[#D64545] whitespace-nowrap">Hãy lưu hồ sơ để áp dụng thay đổi</div>
      )}
    </form>
  );
}
