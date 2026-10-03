"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Settings, Sparkles, ChevronDown, PanelLeftClose, PanelLeftOpen, Pin, PinOff, Trash2, AlertCircle, MessageSquare, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { formatRelativeTime, type AiConversation, type AiConversationMode } from "@/lib/ai/conversations";

interface AiSidebarProps {
  signedIn: boolean;
  authLoaded: boolean;
  conversations: AiConversation[];
  activeId: string | null;
  loading: boolean;
  detailLoading: boolean;
  syncError: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onNewQuiz: () => void;
  onRename: (id: string, title: string) => void;
  onTogglePin: (id: string, pinned: boolean) => void;
  onDelete: (id: string) => void;
  onRetrySync: () => void;
  /** Server-anchored "now" (ms). Falls back to device clock when omitted. */
  nowMs?: number;
}

function ModeBadge({ mode }: { mode: AiConversationMode }) {
  const Icon = mode === 'quiz' ? ListChecks : MessageSquare;
  return (
    <span
      title={mode === 'quiz' ? 'Quiz' : 'Explainer'}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-muted-foreground"
    >
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}

export function AiSidebar({
  signedIn,
  authLoaded,
  conversations,
  activeId,
  loading,
  detailLoading,
  syncError,
  onSelect,
  onNewChat,
  onNewQuiz,
  onRename,
  onTogglePin,
  onDelete,
  onRetrySync,
  nowMs,
}: AiSidebarProps) {
  const router = useRouter();
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [chatToDelete, setChatToDelete] = useState<AiConversation | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const startRename = (chat: AiConversation) => {
    setRenamingId(chat.id);
    setRenameDraft(chat.title);
  };

  const commitRename = (id: string) => {
    const clean = renameDraft.trim();
    if (clean) onRename(id, clean);
    setRenamingId(null);
    setRenameDraft('');
  };

  const confirmDelete = () => {
    if (chatToDelete) onDelete(chatToDelete.id);
    setChatToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <>
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowDeleteModal(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Delete &ldquo;{chatToDelete?.title}&rdquo;?
              </h3>
              <p className="mb-8 text-sm text-muted-foreground">
                This chat will be deleted everywhere on this account.
              </p>
              <div className="flex w-full gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-2xl border border-white/5 bg-white/5 h-12 hover:bg-white/10"
                >
                  Keep it
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 rounded-2xl bg-red-500 h-12 font-semibold text-white hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          aria-label="Show sidebar"
          className="fixed left-4 top-4 z-[70] h-10 w-10 flex items-center justify-center rounded-xl bg-background/60 border border-white/20 text-muted-foreground hover:text-foreground"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      )}

      <aside
        className={`relative z-[60] flex flex-col h-full border-r border-white/20 bg-background/60 backdrop-blur-sm overflow-hidden transition-all duration-200 ${isVisible ? 'w-72 opacity-100' : 'w-0 opacity-0'}`}
      >
        <div className="w-72 p-4 flex flex-col h-full shrink-0">
          <div className="flex flex-col gap-3 mb-6">
            <Button
              variant="default"
              onClick={onNewChat}
              className="w-full justify-start gap-2.5 h-11 px-4 bg-primary/90 hover:bg-primary rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium text-sm">New Chat</span>
            </Button>
            <Button
              variant="outline"
              onClick={onNewQuiz}
              className="w-full justify-start gap-2.5 h-11 px-4 border-white/20 rounded-xl"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">New Quiz</span>
            </Button>
          </div>

          {authLoaded && !signedIn && (
            <button
              onClick={() => router.push('/sign-in')}
              className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:border-white/20 hover:bg-white/[0.06]"
            >
              <p className="text-sm font-medium text-foreground">Sign in to sync</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Chats stay on this device until you sign in.
              </p>
            </button>
          )}

          <div className="h-px w-full bg-border/60 mb-6" />

          <div className="flex-1 overflow-hidden flex flex-col">
            <button
              onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
              className="flex items-center justify-between mb-4 px-2 w-full hover:opacity-70 transition-opacity"
            >
              <h3 className="text-sm font-semibold text-foreground/70">Previous Chats</h3>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isHistoryCollapsed ? '' : 'rotate-180'}`}
              />
            </button>

            {!isHistoryCollapsed && (
              <div className="flex-1 overflow-y-auto pb-2 -mr-2 pr-2">
                {syncError && (
                  <button
                    onClick={onRetrySync}
                    className="mb-2 w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-left transition-colors hover:bg-red-500/15"
                  >
                    <p className="text-sm font-medium text-red-300">Sync unavailable</p>
                    <p className="mt-0.5 text-xs text-red-300/70">
                      {syncError} Tap to retry.
                    </p>
                  </button>
                )}
                {loading && conversations.length === 0 ? (
                  <div className="space-y-2" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.05]" />
                    ))}
                  </div>
                ) : !signedIn ? (
                  <p className="px-2 text-xs leading-5 text-muted-foreground">
                    Your chats will appear here once you sign in — synced across every device on
                    your account.
                  </p>
                ) : conversations.length === 0 ? (
                  <p className="px-2 text-xs leading-5 text-muted-foreground">
                    No chats yet. Start a conversation or generate a quiz.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((chat) => {
                      const isActive = chat.id === activeId;
                      const isRenaming = renamingId === chat.id;
                      return (
                        <div
                          key={chat.id}
                          onClick={() => {
                            if (!isRenaming) onSelect(chat.id);
                          }}
                          className={`group flex flex-col gap-0.5 p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                            isActive ? 'bg-accent/50' : 'hover:bg-accent/30'
                          } ${detailLoading && isActive ? 'opacity-60' : ''}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <ModeBadge mode={chat.mode} />
                              {isRenaming ? (
                                <input
                                  autoFocus
                                  value={renameDraft}
                                  onChange={(e) => setRenameDraft(e.target.value)}
                                  onBlur={() => commitRename(chat.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') commitRename(chat.id);
                                    if (e.key === 'Escape') {
                                      setRenamingId(null);
                                      setRenameDraft('');
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-7 w-full rounded-lg border border-white/15 bg-background px-2 text-sm text-foreground focus:outline-none"
                                />
                              ) : (
                                <span
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    startRename(chat);
                                  }}
                                  title="Double-click to rename"
                                  className="text-sm font-medium truncate text-foreground/80 group-hover:text-foreground"
                                >
                                  {chat.title}
                                </span>
                              )}
                            </div>
                            {!isRenaming && (
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onTogglePin(chat.id, !chat.pinned);
                                  }}
                                  aria-label={chat.pinned ? 'Unpin chat' : 'Pin chat'}
                                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  {chat.pinned ? (
                                    <PinOff className="h-3.5 w-3.5 text-primary" />
                                  ) : (
                                    <Pin className="h-3.5 w-3.5 text-muted-foreground" />
                                  )}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setChatToDelete(chat);
                                    setShowDeleteModal(true);
                                  }}
                                  aria-label="Delete chat"
                                  className="p-1 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                                </button>
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground/50 pl-9">
                            {formatRelativeTime(chat.updated_at, nowMs ?? Date.now())}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 pb-2">
            <div className="h-px w-full bg-border/60 mb-5" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(true)}
                aria-label="Settings"
                title="Settings"
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-transparent hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsVisible(false)}
                aria-label="Hide sidebar"
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-transparent hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
