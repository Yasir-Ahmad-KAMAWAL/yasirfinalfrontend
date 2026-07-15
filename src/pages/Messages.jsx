import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  sendMessageApi,
  getReceivedMessagesApi,
  getSentMessagesApi,
  getUnreadCountApi,
  markAsReadApi,
  getCompanyUsersApi,
  getUserTasksApi,
} from "../api/message.api";
import {
  Send,
  Inbox,
  Mail,
  MailOpen,
  MessageSquare,
  ArrowLeft,
  Loader2,
  CheckCheck,
  Reply,
  ChevronDown,
  X,
} from "lucide-react";

const PRIORITY_STYLES = {
  high: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
};

const STATUS_LINE_COLORS = {
  todo: "bg-orange-500",
  "in-progress": "bg-blue-500",
  done: "bg-green-500",
};

const STATUS_BADGE_STYLES = {
  todo: "text-orange-600 dark:text-orange-400",
  "in-progress": "text-blue-600 dark:text-blue-400",
  done: "text-green-600 dark:text-green-400",
};

const AVATAR_COLORS = [
  "bg-blue-600", "bg-emerald-600", "bg-orange-600", "bg-purple-600", "bg-pink-600",
  "bg-teal-600", "bg-indigo-600", "bg-rose-600", "bg-cyan-600", "bg-amber-600",
  "bg-violet-600", "bg-lime-600", "bg-fuchsia-600", "bg-sky-600", "bg-red-600",
];

const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const getProjectInitials = (name = "") => {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return words.map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }
  return words[0]?.slice(0, 2).toUpperCase() || "";
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const TaskSelector = ({ tasks, selectedTask, onSelect }) => {
  const [open, setOpen] = useState(false);

  const selected = tasks.find((t) => t._id === selectedTask);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Related Task (optional)
      </label>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        {selected ? (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            #{selected.taskNumber} {selected.title}
          </span>
        ) : (
          <span className="text-sm text-slate-400 dark:text-slate-500">Select a task...</span>
        )}
        <ChevronDown size={15} className="text-slate-400 shrink-0" />
      </button>

      {/* Dropdown list styled like issue rows */}
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 z-20 mt-1 max-h-72 overflow-y-auto bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl">
            {tasks.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 p-4 text-center">No tasks available</p>
            ) : (
              <>
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-[#0d0d0d] border-b border-slate-100 dark:border-white/5 px-3 py-2 flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Select a task to discuss</span>
                  <button onClick={() => setOpen(false)} className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X size={14} />
                  </button>
                </div>
                {tasks.map((task) => {
                  const lineColor = STATUS_LINE_COLORS[task.status] || STATUS_LINE_COLORS.todo;
                  const isSelected = task._id === selectedTask;
                  return (
                    <div
                      key={task._id}
                      onClick={() => { onSelect(task._id); setOpen(false); }}
                      className={`flex items-center pl-0 pr-3 py-2 border-b border-slate-100 dark:border-white/5 last:border-b-0 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-500/10"
                          : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                      }`}
                    >
                      {/* Status color line */}
                      <div className={`ml-2 w-[3px] self-stretch shrink-0 rounded-r ${lineColor}`} />

                      {/* Project initials + task number */}
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 shrink-0 w-12 text-center">
                        {getProjectInitials(task.projectId?.name)}-{task.taskNumber}
                      </span>

                      {/* Title */}
                      <p className="flex-1 min-w-0 text-xs font-medium text-slate-900 dark:text-white truncate px-1">
                        {task.title}
                      </p>

                      {/* Assignee avatar */}
                      <div className="w-[30px] flex justify-center shrink-0">
                        {task.assignedTo ? (
                          <div className={`w-5 h-5 rounded-full ${getAvatarColor(task.assignedTo?.name)} flex items-center justify-center text-white text-[7px] font-semibold`}>
                            {getInitials(task.assignedTo?.name)}
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        )}
                      </div>

                      {/* Priority badge */}
                      <span className={`text-[9px] font-semibold px-1 py-0.5 rounded w-[50px] text-center shrink-0 ${PRIORITY_STYLES[task.priority] || ""}`}>
                        {task.priority}
                      </span>

                      {/* Status text */}
                      <span className={`text-[10px] font-semibold capitalize w-[65px] text-center shrink-0 ${STATUS_BADGE_STYLES[task.status] || "text-slate-500"}`}>
                        {task.status === "in-progress" ? "progress" : task.status}
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Tab state: "inbox" | "sent" | "compose"
  const [activeTab, setActiveTab] = useState("inbox");

  // Message lists
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Compose form
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [replyMode, setReplyMode] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const showToastMsg = (msg, type = "success") => {
    setShowToast({ msg, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [receivedRes, sentRes, unreadRes] = await Promise.all([
        getReceivedMessagesApi(),
        getSentMessagesApi(),
        getUnreadCountApi(),
      ]);
      setReceivedMessages(receivedRes.data.data);
      setSentMessages(sentRes.data.data);
      setUnreadCount(unreadRes.data.data.count);
      // Dispatch event to update sidebar badge
      window.dispatchEvent(new Event("refresh-message-count"));
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComposeData = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        getCompanyUsersApi(),
        getUserTasksApi(),
      ]);
      setUsers(usersRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (err) {
      console.error("Failed to fetch compose data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "compose") {
      fetchComposeData();
    }
  }, [activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedReceiver || !messageBody.trim()) {
      showToastMsg("Please select a receiver and write a message", "error");
      return;
    }

    setSending(true);
    try {
      await sendMessageApi({
        receiverId: selectedReceiver,
        taskId: selectedTask || undefined,
        subject: subject.trim(),
        message: messageBody.trim(),
      });
      showToastMsg("Message sent successfully!");
      // Reset form
      setSelectedReceiver("");
      setSelectedTask("");
      setSubject("");
      setMessageBody("");
      setActiveTab("sent");
      fetchData();
    } catch (err) {
      showToastMsg(err.response?.data?.message || "Failed to send message", "error");
    } finally {
      setSending(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      showToastMsg("Please write a reply message", "error");
      return;
    }

    setSending(true);
    try {
      await sendMessageApi({
        receiverId: selectedMessage.sender._id,
        taskId: selectedMessage.task?._id || undefined,
        subject: selectedMessage.subject
          ? `Re: ${selectedMessage.subject}`
          : "Re: Your message",
        message: replyMessage.trim(),
      });
      showToastMsg("Reply sent successfully!");
      setReplyMessage("");
      setReplyMode(false);
      setSelectedMessage(null);
      setActiveTab("sent");
      fetchData();
    } catch (err) {
      showToastMsg(err.response?.data?.message || "Failed to send reply", "error");
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markAsReadApi(messageId);
      fetchData();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    setReplyMode(false);
    setReplyMessage("");
    if (!msg.read) {
      handleMarkAsRead(msg._id);
    }
  };

  const renderMessagePreview = (msg, type) => {
    const isUnread = type === "received" && !msg.read;
    const person = type === "received" ? msg.sender : msg.receiver;

    return (
      <div
        key={msg._id}
        onClick={() => openMessage(msg)}
        className={`flex items-start gap-3 p-4 cursor-pointer border-b border-slate-100 dark:border-white/5 transition-colors ${
          isUnread
            ? "bg-blue-50/50 dark:bg-blue-500/5"
            : "hover:bg-slate-50 dark:hover:bg-white/5"
        }`}
      >
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 ${
          isUnread ? "bg-blue-500" : "bg-slate-400 dark:bg-slate-600"
        }`}>
          {getInitials(person?.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`text-sm truncate ${isUnread ? "font-semibold text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
              {person?.name || "Unknown"}
            </p>
            <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
              {formatDate(msg.createdAt)}
            </span>
          </div>
          {msg.subject && (
            <p className={`text-xs mt-0.5 truncate ${isUnread ? "font-medium text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
              {msg.subject}
            </p>
          )}
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
            {msg.message}
          </p>
          {msg.task && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                #{msg.task.taskNumber} {msg.task.title}
              </span>
            </div>
          )}
        </div>
        {isUnread && (
          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
        )}
      </div>
    );
  };

  const handleReplyClick = () => {
    setReplyMode(true);
    if (tasks.length === 0) {
      fetchComposeData();
    }
  };

  const renderMessageDetail = () => {
    if (!selectedMessage) return null;
    const msg = selectedMessage;
    const person = msg.sender;

    return (
      <div className="p-6">
        <button
          onClick={() => { setSelectedMessage(null); setReplyMode(false); setReplyMessage(""); }}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to {activeTab === "inbox" ? "inbox" : "sent"}
        </button>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-semibold">
              {getInitials(person?.name)}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {person?.name || "Unknown"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {person?.email}
              </p>
            </div>
          </div>

          {/* Reply button for received messages */}
          {activeTab === "inbox" && !replyMode && (
            <button
              onClick={handleReplyClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
            >
              <Reply size={15} />
              Reply
            </button>
          )}
        </div>

        {msg.subject && (
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {msg.subject}
          </h3>
        )}

        {msg.task && (
          <div className="mb-3">
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
              Task #{msg.task.taskNumber}: {msg.task.title}
            </span>
          </div>
        )}

        <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 mb-3">
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {msg.message}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>{new Date(msg.createdAt).toLocaleString()}</span>
            {msg.read && (
              <span className="flex items-center gap-1 text-green-500">
                <CheckCheck size={14} />
                Read {msg.readAt ? formatDate(msg.readAt) : ""}
              </span>
            )}
          </div>
        </div>

        {/* Reply form */}
        {replyMode && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Reply size={15} className="text-blue-500" />
              Reply to {person?.name}
            </h4>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none mb-3"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => { setReplyMode(false); setReplyMessage(""); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={sending || !replyMessage.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {sending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                {sending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCompose = () => (
    <form onSubmit={handleSendMessage} className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <Send size={18} className="text-orange-500" />
        Compose Message
      </h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          To <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedReceiver}
          onChange={(e) => setSelectedReceiver(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          required
        >
          <option value="">Select a member...</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>

      {/* Task selector with issue-row styling */}
      <TaskSelector
        tasks={tasks}
        selectedTask={selectedTask}
        onSelect={setSelectedTask}
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Subject (optional)
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief subject..."
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          placeholder="Write your message here..."
          rows={6}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={sending || !selectedReceiver || !messageBody.trim()}
          className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 dark:disabled:bg-orange-800 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {sending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {sending ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare size={24} className="text-orange-500" />
          Messages
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Communicate with team members about tasks
        </p>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
            showToast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {showToast.msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-slate-200 dark:border-white/10">
        <button
          onClick={() => { setActiveTab("inbox"); setSelectedMessage(null); setReplyMode(false); setReplyMessage(""); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "inbox"
              ? "border-orange-500 text-orange-600 dark:text-orange-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
          }`}
        >
          <Inbox size={16} />
          Inbox
          {unreadCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-500 text-white">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => { setActiveTab("sent"); setSelectedMessage(null); setReplyMode(false); setReplyMessage(""); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "sent"
              ? "border-orange-500 text-orange-600 dark:text-orange-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
          }`}
        >
          <Mail size={16} />
          Sent
        </button>
        <button
          onClick={() => { setActiveTab("compose"); setSelectedMessage(null); setReplyMode(false); setReplyMessage(""); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "compose"
              ? "border-orange-500 text-orange-600 dark:text-orange-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
          }`}
        >
          <Send size={16} />
          Compose
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={24} className="animate-spin text-slate-400" />
          </div>
        ) : activeTab === "compose" ? (
          renderCompose()
        ) : selectedMessage ? (
          renderMessageDetail()
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {activeTab === "inbox" ? (
              receivedMessages.length > 0 ? (
                receivedMessages.map((msg) => renderMessagePreview(msg, "received"))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
                  <MailOpen size={32} className="mb-2" />
                  <p className="text-sm">No messages yet</p>
                </div>
              )
            ) : (
              sentMessages.length > 0 ? (
                sentMessages.map((msg) => renderMessagePreview(msg, "sent"))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
                  <Mail size={32} className="mb-2" />
                  <p className="text-sm">No sent messages</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;