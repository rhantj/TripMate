/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { TravelPlan, ItineraryDay, ItineraryActivity } from "../types";
import { EditIcon, ShareIcon, BookmarkIcon, SaveIcon, InfoIcon, LightbulbIcon, PlusCircleIcon, TrashIcon, CheckIcon } from "./Icons";

interface PlanResultViewProps {
  plan: TravelPlan;
  isSavedMode?: boolean; // If true, it was loaded from My Page
  onSaveToMyPage?: (plan: TravelPlan) => void;
  onUpdatePlan?: (plan: TravelPlan) => void;
  onBackToMyPage?: () => void;
}

export default function PlanResultView({
  plan: initialPlan,
  isSavedMode = false,
  onSaveToMyPage,
  onUpdatePlan,
  onBackToMyPage
}: PlanResultViewProps) {
  const [plan, setPlan] = useState<TravelPlan>(initialPlan);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  const selectedDay = plan.planContent?.[selectedDayIdx] || plan.planContent?.[0];

  const handleShare = () => {
    const textToCopy = `✈️ [TripMate AI] ${plan.destination} 여행 일정\n- 기간: ${plan.duration}\n- 날짜: ${plan.startDate} ~ ${plan.endDate}\n\n상세 일정은 트립메이트 AI에서 확인해 보세요!`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("여행 일정이 클립보드에 복사되었습니다! 친구들에게 공유해보세요.");
    });
  };

  const handleSave = () => {
    if (onSaveToMyPage) {
      onSaveToMyPage(plan);
    }
  };

  // Editing activity fields helper
  const handleActivityChange = (actIdx: number, field: keyof ItineraryActivity, value: any) => {
    const updatedContent = [...plan.planContent];
    const day = updatedContent[selectedDayIdx];
    if (day && day.activities?.[actIdx]) {
      day.activities[actIdx] = {
        ...day.activities[actIdx],
        [field]: value
      };
      setPlan({
        ...plan,
        planContent: updatedContent
      });
    }
  };

  const handleDeleteActivity = (actIdx: number) => {
    const updatedContent = [...plan.planContent];
    const day = updatedContent[selectedDayIdx];
    if (day) {
      day.activities = day.activities.filter((_, idx) => idx !== actIdx);
      setPlan({
        ...plan,
        planContent: updatedContent
      });
    }
  };

  const handleAddActivity = () => {
    const updatedContent = [...plan.planContent];
    const day = updatedContent[selectedDayIdx];
    if (day) {
      const newAct: ItineraryActivity = {
        time: "오후 04:00",
        title: "새로운 장소",
        description: "원하시는 상세 정보를 직접 편집해 보세요.",
        location: `${plan.destination} 어딘가`,
        category: "관광",
        tags: ["새일정"]
      };
      day.activities = [...day.activities, newAct];
      setPlan({
        ...plan,
        planContent: updatedContent
      });
    }
  };

  const handleSaveChangesOnBackend = async () => {
    setSavingLoading(true);
    try {
      if (onUpdatePlan) {
        await onUpdatePlan(plan);
      }
      setIsEditing(false);
      alert("변경 사항이 성공적으로 저장되었습니다!");
    } catch (err) {
      console.error(err);
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto select-none animate-in fade-in slide-in-from-bottom duration-500 pb-16">
      {/* Header and top buttons */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-outline-variant/30">
        <div>
          <span className="text-primary font-bold text-xs uppercase tracking-wider">
            나만의 {plan.destination} 여행
          </span>
          <h2 className="font-headline-lg text-headline-lg mt-2 text-on-surface font-extrabold select-text">
            {plan.title}
          </h2>
          <p className="text-on-surface-variant text-sm mt-1 max-w-xl">
            {plan.destination}의 숨은 비경과 취향을 녹인 특별한 여정입니다. 일차별 카드를 자유롭게 누르며 수동으로 장소를 추가하거나 삭제할 수도 있습니다.
          </p>
        </div>

        {/* Action icons bar */}
        <div className="flex flex-wrap gap-2 items-center">
          {onBackToMyPage && (
            <button
              onClick={onBackToMyPage}
              className="flex items-center gap-1.5 bg-surface-container hover:bg-surface-variant px-4 py-2.5 rounded-xl text-on-surface font-semibold text-xs border border-transparent cursor-pointer active:scale-95 transition-all"
            >
              종료
            </button>
          )}

          {isEditing ? (
            <button
              onClick={handleSaveChangesOnBackend}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs border-none cursor-pointer active:scale-95 transition-all shadow-md"
              disabled={savingLoading}
            >
              {savingLoading ? "저장 중..." : "변경 사항 저장"}
              <CheckIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 bg-surface-container hover:bg-surface-variant px-4 py-2.5 rounded-xl text-on-surface font-semibold text-xs border border-transparent cursor-pointer active:scale-95 transition-all"
            >
              수정하기 (수동 편집)
              <EditIcon className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-surface-container hover:bg-surface-variant px-4 py-2.5 rounded-xl text-on-surface font-semibold text-xs border border-transparent cursor-pointer active:scale-95 transition-all"
          >
            공유하기
            <ShareIcon className="w-4 h-4" />
          </button>

          {!isSavedMode && onSaveToMyPage && (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-primary-container text-on-primary-container px-4 py-2.5 rounded-xl font-bold text-xs border-none shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              보관함 저장하기
              <BookmarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Days Selection Tab pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide flex-nowrap shrink-0">
        {plan.planContent?.map((dayObj, idx) => {
          const isSelected = selectedDayIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDayIdx(idx)}
              className={`flex-shrink-0 px-5  py-2.5 rounded-full border transition-all active:scale-95 cursor-pointer text-xs ${
                isSelected
                  ? "bg-primary border-primary text-white font-bold shadow-md shadow-primary/10"
                  : "border-outline-variant bg-white text-on-surface-variant hover:border-slate-400 font-semibold"
              }`}
            >
              Day {dayObj.day}
            </button>
          );
        })}
      </div>

      {/* Grid: Map + Timeline details */}
      {selectedDay && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
          {/* Left Column: Place visual insights */}
          <div className="md:col-span-4 space-y-6">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md group">
              <img
                alt="map-placeholder"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaU69A5xqMnI0MlMgQp3Zj8c2NBTgkJSpaJSjRShbjd-01fKWeb_0c7dzX6gyvc__MEEXaGmeKnp34cOhrjA_IvrcMzr6_gjgKMqc2uTS7NvtTTUsbj8v65kDZfqGozEnG69PAqAAKiVRNUQ0wJVPw2M5TPitNHZcaVbGPxtRM0lgbdkBH6I_SHascBjsKzlo5n3bClrWI3ZWZfq-mY_9avC2lTQjT94gfxiKDm3JHW9OcSudOAq4WV78TTt3ex1jp4qUra3EIZZg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm font-bold flex items-center justify-center text-white">
                    location_on
                  </span>
                  <span className="font-label-md text-xs font-bold">{plan.destination} 시내</span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedDay.activities?.[0]?.title || plan.destination
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/25 hover:bg-white/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-label-md text-white border-0 transition-all font-semibold select-none"
                >
                  지도에서 검색
                </a>
              </div>
            </div>

            {/* AI Travel Tip Card */}
            <div className="bg-white p-5 rounded-2xl border border-outline-variant/35 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary font-bold flex items-center justify-center text-lg">
                  lightbulb
                </span>
                <h4 className="font-label-md text-xs font-bold text-primary">AI 여행 가이드 팁</h4>
              </div>
              <p className="text-xs leading-relaxed text-on-surface-variant font-medium leading-relaxed">
                오후 일정 진행 시 반드시 지역 명소를 클릭하여 구글 지도로 최적 동선을 미리 체크하세요. 트립메이트 AI는 사용님의 취향인 '{plan.styles.slice(0, 2).join(", ")}' 분위기를 세심히 조밀 조율하였습니다.
              </p>
            </div>
          </div>

          {/* Right Column: Activities Timeline (수정, 추가, 삭제 가능) */}
          <div className="md:col-span-8 relative">
            <div className="absolute left-[24px] top-6 bottom-6 w-[2px] bg-sky-200 hidden sm:block z-0" />
            
            <div className="space-y-6 select-text mb-4">
              <div className="pl-0 sm:pl-16 mb-4">
                <div className="p-3 bg-primary-container/10 border border-primary-container/20 rounded-xl">
                  {isEditing ? (
                    <div className="space-y-1">
                      <label className="text-[10px] text-primary font-bold">일차 테마 수정</label>
                      <input
                        type="text"
                        value={selectedDay.theme}
                        onChange={(e) => {
                          const updated = [...plan.planContent];
                          updated[selectedDayIdx].theme = e.target.value;
                          setPlan({ ...plan, planContent: updated });
                        }}
                        className="w-full text-base font-extrabold text-on-surface bg-white border border-outline p-1.5 rounded outline-none text-sm"
                      />
                    </div>
                  ) : (
                    <h3 className="text-base font-extrabold text-primary leading-snug">
                      Day {selectedDay.day} 테마: {selectedDay.theme}
                    </h3>
                  )}
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {selectedDay.description}
                  </p>
                </div>
              </div>

              {selectedDay.activities?.map((act, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-5 relative group z-10 select-none">
                  {/* Timeline Badge */}
                  <div className="flex items-center gap-3 sm:w-16 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-md ring-4 ring-[#f8f9fa] shrink-0 font-bold">
                      <span className="material-symbols-outlined text-base xl:text-lg flex items-center justify-center text-white">
                        {act.category === "맛집" ? "restaurant" : act.category === "카페" ? "local_cafe" : act.category === "쇼핑" ? "shopping_bag" : "explore"}
                      </span>
                    </div>
                    <span className="sm:hidden font-label-md text-primary font-bold text-xs">
                      {act.time}
                    </span>
                  </div>

                  {/* Editing Card / Reading Card */}
                  <div className="flex-1 bg-white p-5 rounded-2xl border border-outline-variant/40 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow relative">
                    {isEditing ? (
                      <div className="space-y-3 p-1">
                        {/* Edit Header Time & Title */}
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-outline font-bold">시간</label>
                            <input
                              type="text"
                              value={act.time}
                              onChange={(e) => handleActivityChange(idx, "time", e.target.value)}
                              className="w-full border border-outline p-1 rounded text-xs"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] text-outline font-bold">장소/카테고리</label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={act.title}
                                onChange={(e) => handleActivityChange(idx, "title", e.target.value)}
                                className="w-full border border-outline p-1 rounded text-xs"
                              />
                              <select
                                value={act.category}
                                onChange={(e) => handleActivityChange(idx, "category", e.target.value)}
                                className="w-full border border-outline p-1.5 rounded text-xs bg-white text-sm"
                              >
                                <option value="맛집">맛집</option>
                                <option value="카페">카페</option>
                                <option value="쇼핑">쇼핑</option>
                                <option value="관광">관광</option>
                                <option value="이동">이동</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div>
                          <label className="text-[10px] text-outline font-bold">주소 / 상세 위치</label>
                          <input
                            type="text"
                            value={act.location}
                            onChange={(e) => handleActivityChange(idx, "location", e.target.value)}
                            className="w-full border border-outline p-1.5 rounded text-xs"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="text-[10px] text-outline font-bold">활동 설명 및 가이드 팁</label>
                          <textarea
                            value={act.description}
                            onChange={(e) => handleActivityChange(idx, "description", e.target.value)}
                            className="w-full border border-outline p-1.5 rounded text-xs h-16 resize-none outline-none font-medium"
                          />
                        </div>

                        {/* Delete single activity widget */}
                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteActivity(idx)}
                            className="flex items-center gap-1 text-error hover:bg-error-container/20 px-3 py-1.5 rounded-lg text-xs font-bold border-none bg-transparent cursor-pointer active:scale-95 transition-all"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                            장소 삭제
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-base font-extrabold text-on-surface truncate pr-2">
                            {act.title}
                          </h4>
                          <span className="hidden sm:block text-primary font-label-md text-xs font-extrabold shrink-0">
                            {act.time}
                          </span>
                        </div>

                        <div className="flex gap-4 items-start mb-3 select-text">
                          {act.imageUrl && (
                            <img
                              alt={act.title}
                              src={act.imageUrl}
                              className="w-20 h-20 rounded-xl object-cover shrink-0 select-none bg-surface"
                            />
                          )}
                          <div className="space-y-1">
                            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                              {act.description}
                            </p>
                            <p className="text-[11px] text-outline flex items-center gap-1 font-semibold select-all">
                              <span className="material-symbols-outlined text-xs flex items-center justify-center">
                                location_on
                              </span>
                              {act.location}
                            </p>
                          </div>
                        </div>

                        {/* Category and custom action redirects */}
                        <div className="flex gap-2 items-center flex-wrap pt-1 select-none">
                          <span className="px-2.5 py-1 bg-surface-container rounded-full text-[10px] font-bold text-outline">
                            #{act.category}
                          </span>
                          {act.mustVisit && (
                            <span className="px-2.5 py-1 bg-secondary-container/15 text-secondary-container-variant font-bold text-[10px] rounded-full text-secondary">
                              필수 방문 Spot
                            </span>
                          )}
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              act.title + " " + act.location
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-primary hover:underline ml-auto font-bold select-none p-1 flex items-center gap-0.5"
                          >
                            구글 맵 검색
                            <span className="material-symbols-outlined text-xs flex items-center justify-center font-bold">
                              arrow_forward
                            </span>
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Editable add activity block */}
              {isEditing && (
                <div className="pl-0 sm:pl-16">
                  <button
                    onClick={handleAddActivity}
                    type="button"
                    className="w-full h-14 border-2 border-dashed border-outline-variant/60 rounded-xl flex items-center justify-center gap-2 text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all cursor-pointer bg-white"
                  >
                    <PlusCircleIcon className="w-5 h-5 text-primary" />
                    <span className="font-label-md text-xs font-extrabold text-primary">새로운 활동 명소 추가하기</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
