(function () {
    let selectedSubject = '';
    let currentFilter = 'all';
    let currentSort = 'created';
    let cachedTasks = [];
    const pendingTaskIds = new Set();

    async function getUser() {
        if (!window.supabase) return null;
        const { data: { user } } = await window.supabase.auth.getUser();
        return user || null;
    }

    async function ensureDashboardRow(userId) {
        const { data, error } = await window.supabase
            .from('dashboard')
            .select('id')
            .eq('id', userId)
            .single();

        if (!error && data) return;

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        const { error: insertError } = await window.supabase
            .from('dashboard')
            .insert({ id: userId })
            .select()
            .single();

        if (insertError) throw insertError;
    }

    function openNewTaskPanelImpl() {
        const overlay = document.getElementById('new-task-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }

        const form = document.getElementById('new-task-form');
        if (form && typeof form.reset === 'function') {
            form.reset();
        }

        selectedSubject = '';
        const subjectChips = document.querySelectorAll('.subject-chip');
        subjectChips.forEach((chip) => chip.classList.remove('active'));

        const subjectInput = document.getElementById('task-subject');
        if (subjectInput) subjectInput.value = '';
    }

    function closeNewTaskPanelImpl() {
        const overlay = document.getElementById('new-task-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    function setupSubjectChips() {
        const chips = document.querySelectorAll('.subject-chip');
        const subjectInput = document.getElementById('task-subject');

        chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                chips.forEach((c) => c.classList.remove('active'));
                chip.classList.add('active');
                selectedSubject = chip.dataset.subject || '';
                if (subjectInput) subjectInput.value = selectedSubject;
            });
        });
    }

    function getTasksFromDashboard(dashboard) {
        const tasks = dashboard?.tasks;
        if (Array.isArray(tasks)) return tasks;
        if (tasks && typeof tasks === 'object') return Object.values(tasks);
        return [];
    }

    function applyFilterAndSort(tasks) {
        let next = tasks.slice();

        if (currentFilter === 'pending') {
            next = next.filter((t) => !t.completed);
        } else if (currentFilter === 'completed') {
            next = next.filter((t) => t.completed);
        }

        if (currentSort === 'created') {
            next.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        } else if (currentSort === 'priority') {
            const rank = { high: 0, medium: 1, low: 2 };
            next.sort((a, b) => (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9));
        } else if (currentSort === 'subject') {
            next.sort((a, b) => String(a.subject || '').localeCompare(String(b.subject || '')));
        } else if (currentSort === 'due') {
            next.sort((a, b) => String(a.due_date || '').localeCompare(String(b.due_date || '')));
        }

        return next;
    }

    function getTaskId(task) {
        return task.created_at || `${task.name}-${task.subject}`;
    }

    function getPriorityClass(priority) {
        if (priority === 'high') return 'priority-high';
        if (priority === 'low') return 'priority-low';
        return 'priority-medium';
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderCompleteButton(task, taskId) {
        const isCompleted = Boolean(task.completed);
        const isPending = pendingTaskIds.has(taskId);
        const label = isCompleted ? 'Mark as incomplete' : 'Mark as complete';
        const icon = isPending ? 'ph-circle-notch' : isCompleted ? 'ph-check-circle' : 'ph-circle';

        return `
            <button
                type="button"
                class="task-complete-btn ${isCompleted ? 'is-completed' : ''} ${isPending ? 'is-loading' : ''}"
                data-task-id="${escapeHtml(taskId)}"
                aria-label="${label}"
                title="${label}"
                ${isPending ? 'disabled aria-busy="true"' : ''}
            >
                <i class="ph ${icon}"></i>
            </button>
        `;
    }

    async function persistTasks(user, tasks) {
        const { error } = await window.supabase
            .from('dashboard')
            .update({ tasks })
            .eq('id', user.id);

        if (error) throw error;
    }

    function updateClearCompletedButton(tasks) {
        const button = document.getElementById('clear-completed-btn');
        if (!button) return;

        const completedCount = tasks.filter((task) => task.completed).length;
        const label = button.querySelector('span');
        if (label) {
            label.textContent = completedCount > 0
                ? `Clear Completed (${completedCount})`
                : 'Clear Completed';
        }

        button.disabled = completedCount === 0 || button.classList.contains('is-loading');
        button.setAttribute('aria-disabled', completedCount === 0 ? 'true' : 'false');
    }

    function refreshUI() {
        updateStats(cachedTasks);
        updateClearCompletedButton(cachedTasks);
        renderTasks(applyFilterAndSort(cachedTasks));
    }

    function setupTaskActions() {
        const tasksList = document.getElementById('tasks-list');
        if (!tasksList || tasksList.dataset.actionsBound === 'true') return;

        tasksList.dataset.actionsBound = 'true';
        tasksList.addEventListener('click', (event) => {
            const button = event.target.closest('.task-complete-btn');
            if (!button || button.disabled || button.classList.contains('is-loading')) return;

            const taskId = button.dataset.taskId;
            if (!taskId) return;

            toggleTaskCompletion(taskId).catch((err) => {
                console.error('toggleTaskCompletion failed:', err);
            });
        });
    }

    function setupClearCompletedButton() {
        const button = document.getElementById('clear-completed-btn');
        if (!button || button.dataset.bound === 'true') return;

        button.dataset.bound = 'true';
        button.addEventListener('click', () => {
            openClearCompletedPanelImpl();
        });
    }

    function openClearCompletedPanelImpl() {
        const completedTasks = cachedTasks.filter((task) => task.completed);
        if (completedTasks.length === 0) return;

        const overlay = document.getElementById('clear-completed-overlay');
        if (!overlay) return;

        renderClearCompletedList(completedTasks);
        overlay.classList.remove('hidden');
    }

    function closeClearCompletedPanelImpl() {
        const overlay = document.getElementById('clear-completed-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    function getSelectedClearTaskIds() {
        const list = document.getElementById('clear-completed-list');
        if (!list) return [];

        return Array.from(list.querySelectorAll('.clear-task-checkbox:checked'))
            .map((input) => input.value);
    }

    function updateClearSelectionUI() {
        const list = document.getElementById('clear-completed-list');
        const selectedBtn = document.getElementById('clear-selected-btn');
        const selectAll = document.getElementById('clear-select-all');
        if (!list || !selectedBtn || !selectAll) return;

        const checkboxes = Array.from(list.querySelectorAll('.clear-task-checkbox'));
        const selectedCount = checkboxes.filter((box) => box.checked).length;

        selectAll.checked = checkboxes.length > 0 && selectedCount === checkboxes.length;
        selectAll.indeterminate = selectedCount > 0 && selectedCount < checkboxes.length;

        selectedBtn.disabled = selectedCount === 0 || selectedBtn.classList.contains('is-loading');
        selectedBtn.textContent = selectedCount > 0
            ? `Clear Selected (${selectedCount})`
            : 'Clear Selected';
    }

    function renderClearCompletedList(completedTasks) {
        const list = document.getElementById('clear-completed-list');
        const clearAllBtn = document.getElementById('clear-all-completed-btn');
        const selectAll = document.getElementById('clear-select-all');
        if (!list || !clearAllBtn) return;

        if (!completedTasks.length) {
            list.innerHTML = '<p class="clear-completed-empty">No completed tasks to clear.</p>';
            clearAllBtn.disabled = true;
            updateClearSelectionUI();
            return;
        }

        clearAllBtn.disabled = false;
        clearAllBtn.textContent = `Clear All Completed (${completedTasks.length})`;

        list.innerHTML = completedTasks.map((task) => {
            const taskId = getTaskId(task);
            const timeText = task.time ? `${task.time} min` : '';
            const priorityLabel = task.priority === 'high'
                ? 'High'
                : task.priority === 'low'
                    ? 'Low'
                    : 'Medium';

            return `
                <label class="clear-completed-item ${getPriorityClass(task.priority)}">
                    <input type="checkbox" class="clear-task-checkbox" value="${escapeHtml(taskId)}">
                    <div class="clear-completed-item-content">
                        <span class="clear-completed-item-name">${escapeHtml(task.name)}</span>
                        <div class="clear-completed-item-meta">
                            <span>${escapeHtml(task.subject || 'General')}</span>
                            ${timeText ? `<span>${escapeHtml(timeText)}</span>` : ''}
                            <span>${priorityLabel}</span>
                        </div>
                    </div>
                </label>
            `;
        }).join('');

        if (selectAll) {
            selectAll.checked = false;
            selectAll.indeterminate = false;
        }

        updateClearSelectionUI();
    }

    function setupClearCompletedPanel() {
        const overlay = document.getElementById('clear-completed-overlay');
        if (!overlay || overlay.dataset.bound === 'true') return;

        overlay.dataset.bound = 'true';

        const list = document.getElementById('clear-completed-list');
        const selectAll = document.getElementById('clear-select-all');
        const selectedBtn = document.getElementById('clear-selected-btn');
        const clearAllBtn = document.getElementById('clear-all-completed-btn');

        if (list) {
            list.addEventListener('change', (event) => {
                if (event.target.classList.contains('clear-task-checkbox')) {
                    updateClearSelectionUI();
                }
            });
        }

        if (selectAll) {
            selectAll.addEventListener('change', () => {
                const checkboxes = overlay.querySelectorAll('.clear-task-checkbox');
                checkboxes.forEach((box) => {
                    box.checked = selectAll.checked;
                });
                updateClearSelectionUI();
            });
        }

        if (selectedBtn) {
            selectedBtn.addEventListener('click', () => {
                removeCompletedTasksImpl(getSelectedClearTaskIds()).catch((err) => {
                    console.error('clear selected tasks failed:', err);
                });
            });
        }

        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                const completedIds = cachedTasks
                    .filter((task) => task.completed)
                    .map((task) => getTaskId(task));
                removeCompletedTasksImpl(completedIds).catch((err) => {
                    console.error('clear all completed tasks failed:', err);
                });
            });
        }
    }

    async function removeCompletedTasksImpl(taskIds) {
        const uniqueIds = [...new Set(taskIds.filter(Boolean))];
        if (!uniqueIds.length) return;

        const user = await getUser();
        if (!user) {
            alert('Please log in to manage tasks.');
            return;
        }

        const previousTasks = cachedTasks.slice();
        const idSet = new Set(uniqueIds);

        cachedTasks = cachedTasks.filter((task) => !idSet.has(getTaskId(task)));
        refreshUI();

        const selectedBtn = document.getElementById('clear-selected-btn');
        const clearAllBtn = document.getElementById('clear-all-completed-btn');
        const clearMainBtn = document.getElementById('clear-completed-btn');

        [selectedBtn, clearAllBtn, clearMainBtn].forEach((btn) => {
            if (btn) btn.classList.add('is-loading');
        });

        try {
            await persistTasks(user, cachedTasks);
            closeClearCompletedPanelImpl();
        } catch (err) {
            cachedTasks = previousTasks;
            refreshUI();
            alert('Could not clear the selected tasks. Please try again.');
            throw err;
        } finally {
            [selectedBtn, clearAllBtn, clearMainBtn].forEach((btn) => {
                if (btn) btn.classList.remove('is-loading');
            });
            updateClearCompletedButton(cachedTasks);
        }
    }

    function renderTasks(tasks) {
        const tasksList = document.getElementById('tasks-list');
        if (!tasksList) return;

        tasksList.innerHTML = '';

        if (!tasks.length) {
            const emptyCopy = currentFilter === 'completed'
                ? 'No completed tasks right now.'
                : currentFilter === 'pending'
                    ? 'All caught up — no pending tasks.'
                    : 'Create your first task to get started with organized studying';

            tasksList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="ph ph-clipboard-text"></i>
                    </div>
                    <h3>No tasks yet</h3>
                    <p>${emptyCopy}</p>
                    ${currentFilter === 'all' ? `
                        <button class="action-btn primary" onclick="openNewTaskPanel()">
                            <i class="ph ph-plus"></i>
                            <span>Create Task</span>
                        </button>
                    ` : ''}
                </div>
            `;
            return;
        }

        tasks.forEach((task) => {
            const priorityClass = getPriorityClass(task.priority);
            const taskId = getTaskId(task);
            const taskCard = document.createElement('div');
            taskCard.className = `task-card ${priorityClass} ${task.completed ? 'completed' : ''}`;
            taskCard.dataset.taskId = taskId;

            const timeText = task.time ? `${task.time} min` : '';
            taskCard.innerHTML = `
                <div class="task-header">
                    <div class="task-content">
                        <span class="task-name">${escapeHtml(task.name)}</span>
                        <div class="task-meta">
                            <span class="task-subject">
                                <i class="ph ph-book"></i>
                                ${escapeHtml(task.subject)}
                            </span>
                            <span class="task-time">
                                <i class="ph ph-clock"></i>
                                ${escapeHtml(timeText)}
                            </span>
                        </div>
                    </div>
                    ${renderCompleteButton(task, taskId)}
                </div>
                ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            `;

            tasksList.appendChild(taskCard);
        });
    }

    function updateStats(allTasks) {
        const totalEl = document.getElementById('total-tasks');
        const pendingEl = document.getElementById('pending-tasks');
        const completedEl = document.getElementById('completed-tasks');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        const total = allTasks.length;
        const completed = allTasks.filter((t) => t.completed).length;
        const pending = total - completed;
        const pct = total ? Math.round((completed / total) * 100) : 0;

        if (totalEl) totalEl.textContent = String(total);
        if (pendingEl) pendingEl.textContent = String(pending);
        if (completedEl) completedEl.textContent = String(completed);
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressText) progressText.textContent = `${completed} of ${total} tasks completed`;
    }

    async function loadTasksAndRender() {
        const user = await getUser();
        if (!user) return;

        await ensureDashboardRow(user.id);

        const { data: dashboard, error } = await window.supabase
            .from('dashboard')
            .select('tasks')
            .eq('id', user.id)
            .single();

        if (error) throw error;

        cachedTasks = getTasksFromDashboard(dashboard);
        refreshUI();
    }

    async function handleNewTaskFormSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();

        const user = await getUser();
        if (!user) return;
        await ensureDashboardRow(user.id);

        const nameEl = document.getElementById('task-name');
        const timeEl = document.getElementById('task-time');
        const priorityEl = document.getElementById('task-priority');
        const descEl = document.getElementById('task-description');
        const subjectEl = document.getElementById('task-subject');

        const name = (nameEl?.value || '').trim();
        const time = parseInt(timeEl?.value || '', 10);
        const priority = priorityEl?.value || 'medium';
        const description = (descEl?.value || '').trim();
        const subject = (selectedSubject || subjectEl?.value || '').trim();

        if (!name) {
            alert('Please enter a task name');
            return;
        }

        if (!time || Number.isNaN(time)) {
            alert('Please select estimated time');
            return;
        }

        if (!subject) {
            alert('Please select a subject');
            return;
        }

        const newTask = {
            name,
            time,
            subject,
            priority,
            description,
            completed: false,
            created_at: new Date().toISOString()
        };

        cachedTasks = [...cachedTasks, newTask];
        refreshUI();

        try {
            await persistTasks(user, cachedTasks);
            closeNewTaskPanelImpl();
        } catch (err) {
            cachedTasks = cachedTasks.filter((task) => getTaskId(task) !== getTaskId(newTask));
            refreshUI();
            throw err;
        }
    }

    function setActiveFilterButton(filter) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach((btn) => {
            btn.classList.toggle('active', btn.textContent.toLowerCase().includes(filter) || (filter === 'all' && btn.textContent.toLowerCase().includes('all')));
        });
    }

    async function toggleTaskCompletion(taskId) {
        if (pendingTaskIds.has(taskId)) return;

        const user = await getUser();
        if (!user) {
            alert('Please log in to manage tasks.');
            return;
        }

        const taskIndex = cachedTasks.findIndex((task) => getTaskId(task) === taskId);
        if (taskIndex === -1) return;

        const previousCompleted = cachedTasks[taskIndex].completed;
        const nextCompleted = !previousCompleted;

        pendingTaskIds.add(taskId);
        cachedTasks[taskIndex] = {
            ...cachedTasks[taskIndex],
            completed: nextCompleted,
            completed_at: nextCompleted ? new Date().toISOString() : null
        };

        refreshUI();

        try {
            await persistTasks(user, cachedTasks);
        } catch (err) {
            cachedTasks[taskIndex] = {
                ...cachedTasks[taskIndex],
                completed: previousCompleted
            };
            refreshUI();
            alert('Could not update the task. Please try again.');
            throw err;
        } finally {
            pendingTaskIds.delete(taskId);
            refreshUI();
        }
    }

    window.completeTask = function completeTask(taskId) {
        toggleTaskCompletion(taskId).catch((err) => console.error('completeTask failed:', err));
    };

    window.clearCompletedTasks = function clearCompletedTasks() {
        openClearCompletedPanelImpl();
    };

    window.openClearCompletedPanel = openClearCompletedPanelImpl;
    window.closeClearCompletedPanel = closeClearCompletedPanelImpl;

    if (typeof window.openNewTaskPanel !== 'function') {
        window.openNewTaskPanel = openNewTaskPanelImpl;
    }

    if (typeof window.closeNewTaskPanel !== 'function') {
        window.closeNewTaskPanel = closeNewTaskPanelImpl;
    }

    if (typeof window.sortTasks !== 'function') {
        window.sortTasks = function sortTasks(criteria) {
            currentSort = criteria;
            refreshUI();
        };
    }

    if (typeof window.filterTasks !== 'function') {
        window.filterTasks = function filterTasks(filter) {
            currentFilter = filter;
            setActiveFilterButton(filter);
            refreshUI();
        };
    }

    document.addEventListener('DOMContentLoaded', () => {
        try {
            setupSubjectChips();
            setupTaskActions();
            setupClearCompletedButton();
            setupClearCompletedPanel();
            const form = document.getElementById('new-task-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    handleNewTaskFormSubmit(e).catch((err) => console.error('Create task failed:', err));
                });
            }

            loadTasksAndRender().catch((err) => console.error('loadTasksAndRender failed:', err));
        } catch (err) {
            console.error('Tasks init failed:', err);
        }
    });
})();
