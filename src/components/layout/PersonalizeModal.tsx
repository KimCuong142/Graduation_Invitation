import React, { useState } from 'react';
import { InvitationData } from '../../types/invitation';
import { X, Save, RotateCcw, Share2, Printer, Upload, Check, Sparkles } from 'lucide-react';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvitationData;
  onSave: (newData: InvitationData) => void;
  onReset: () => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<InvitationData>(data);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'guest' | 'graduate' | 'event' | 'diamond'>('guest');

  if (!isOpen) return null;

  const handleChange = (field: keyof InvitationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDiamondChange = (field: keyof InvitationData['diamondGrading'], value: string) => {
    setFormData(prev => ({
      ...prev,
      diamondGrading: {
        ...prev.diamondGrading,
        [field]: value
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleChange('portraitUrl', reader.result);
          handleChange('portraitCaption', 'Ảnh chân dung tốt nghiệp');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyShareLink = () => {
    const params = new URLSearchParams();
    params.set('guest', formData.recipientName);
    params.set('grad', formData.graduateName);
    params.set('major', formData.majorName);
    params.set('date', formData.eventDateText);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAndApply = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/90">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C59D5F]" />
            <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#F5DEB0]">
              Tùy Chỉnh Thông Tin Thiệp Mời
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 px-4 text-xs font-sans">
          <button
            onClick={() => setActiveTab('guest')}
            className={`py-3 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'guest'
                ? 'border-[#C59D5F] text-[#F5DEB0]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Khách Mời
          </button>
          <button
            onClick={() => setActiveTab('graduate')}
            className={`py-3 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'graduate'
                ? 'border-[#C59D5F] text-[#F5DEB0]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Cử Nhân & Trường
          </button>
          <button
            onClick={() => setActiveTab('event')}
            className={`py-3 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'event'
                ? 'border-[#C59D5F] text-[#F5DEB0]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Lễ Tốt Nghiệp & Địa Điểm
          </button>
          <button
            onClick={() => setActiveTab('diamond')}
            className={`py-3 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'diamond'
                ? 'border-[#C59D5F] text-[#F5DEB0]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Thông Số Kim Cương
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs">
          
          {/* Tab 1: Guest / Recipient */}
          {activeTab === 'guest' && (
            <div className="space-y-4">
              <div>
                <label className="block text-stone-400 mb-1">Tên khách mời (Recipient Name)</label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={e => handleChange('recipientName', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  placeholder="e.g. Nguyễn Ngọc Thảo"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Tiêu ngữ lời mời (Salutation)</label>
                <input
                  type="text"
                  value={formData.recipientTitle || ''}
                  onChange={e => handleChange('recipientTitle', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  placeholder="You are cordially invited:"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Thông điệp thiệp mời (Message)</label>
                <textarea
                  rows={3}
                  value={formData.invitationMessage}
                  onChange={e => handleChange('invitationMessage', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                />
              </div>

              <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/60 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-stone-200">Tạo liên kết gửi riêng cho khách này</p>
                  <p className="text-[11px] text-stone-400">Gửi đường link đã cá nhân hóa tên khách mời</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#001E3D] border border-[#C59D5F]/40 text-[#F5DEB0] font-medium hover:bg-[#032B52]"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Đã sao chép!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Graduate */}
          {activeTab === 'graduate' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Họ tên Cử nhân</label>
                  <input
                    type="text"
                    value={formData.graduateName}
                    onChange={e => handleChange('graduateName', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Học vị (Degree)</label>
                  <input
                    type="text"
                    value={formData.degreeName}
                    onChange={e => handleChange('degreeName', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Chuyên ngành (Major)</label>
                  <input
                    type="text"
                    value={formData.majorName}
                    onChange={e => handleChange('majorName', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Khoa / Bộ môn (Faculty)</label>
                  <input
                    type="text"
                    value={formData.facultyName}
                    onChange={e => handleChange('facultyName', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Trường Đại học</label>
                  <input
                    type="text"
                    value={formData.universityName}
                    onChange={e => handleChange('universityName', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Khóa học (Class Cohort)</label>
                  <input
                    type="text"
                    value={formData.classCohort}
                    onChange={e => handleChange('classCohort', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
              </div>

              {/* Portrait Upload / Select */}
              <div className="pt-2 border-t border-stone-800">
                <label className="block text-stone-400 mb-2">Hình ảnh đại diện / Chân dung</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded-md border border-stone-700 overflow-hidden bg-stone-800">
                    <img src={formData.portraitUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 cursor-pointer hover:bg-stone-700">
                      <Upload className="w-3.5 h-3.5 text-[#C59D5F]" />
                      <span>Tải ảnh từ máy tính</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        handleChange('portraitUrl', '/assets/graduate-portrait-sculpture.png');
                        handleChange('portraitCaption', 'Self Made Man · Bobbie Carlyle, 1983');
                      }}
                      className="block text-[11px] text-[#C59D5F] hover:underline"
                    >
                      Dùng lại tượng "Self Made Man" gốc Canva
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Event & Schedule */}
          {activeTab === 'event' && (
            <div className="space-y-4">
              <div>
                <label className="block text-stone-400 mb-1">Ngày diễn ra buổi lễ (Date)</label>
                <input
                  type="text"
                  value={formData.eventDateText}
                  onChange={e => handleChange('eventDateText', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Địa điểm (Venue Name)</label>
                <input
                  type="text"
                  value={formData.venueName}
                  onChange={e => handleChange('venueName', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Địa chỉ (Address)</label>
                <input
                  type="text"
                  value={formData.venueAddress}
                  onChange={e => handleChange('venueAddress', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Google Maps Link</label>
                <input
                  type="text"
                  value={formData.googleMapsUrl}
                  onChange={e => handleChange('googleMapsUrl', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-stone-400 mb-1">Email liên hệ</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={e => handleChange('contactEmail', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={e => handleChange('contactPhone', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Diamond Specs */}
          {activeTab === 'diamond' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Trọng lượng (Carat)</label>
                  <input
                    type="text"
                    value={formData.diamondGrading.caratWeight}
                    onChange={e => handleDiamondChange('caratWeight', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Nước màu (Color)</label>
                  <input
                    type="text"
                    value={formData.diamondGrading.colorGrade}
                    onChange={e => handleDiamondChange('colorGrade', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Độ tinh khiết (Clarity)</label>
                  <input
                    type="text"
                    value={formData.diamondGrading.clarityGrade}
                    onChange={e => handleDiamondChange('clarityGrade', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Giác cắt (Cut Grade)</label>
                  <input
                    type="text"
                    value={formData.diamondGrading.cutGrade}
                    onChange={e => handleDiamondChange('cutGrade', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Độ bóng (Polish)</label>
                  <input
                    type="text"
                    value={formData.diamondGrading.polish}
                    onChange={e => handleDiamondChange('polish', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Tính đối xứng (Symmetry)</label>
                  <input
                    type="text"
                    value={formData.diamondGrading.symmetry}
                    onChange={e => handleDiamondChange('symmetry', e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Huỳnh quang (Fluorescence)</label>
                <input
                  type="text"
                  value={formData.diamondGrading.fluorescence}
                  onChange={e => handleDiamondChange('fluorescence', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Câu danh ngôn tốt nghiệp (Quote)</label>
                <textarea
                  rows={2}
                  value={formData.inspirationalQuote}
                  onChange={e => handleChange('inspirationalQuote', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#C59D5F]"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục gốc</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In thiệp</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs font-medium"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#C59D5F] text-[#001E3D] font-bold text-xs hover:bg-[#D4AF37] transition-all shadow-md active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu & Cập nhật</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

