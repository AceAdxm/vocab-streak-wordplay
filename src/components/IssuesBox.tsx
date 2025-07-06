
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, Edit } from 'lucide-react';

interface Issue {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const IssuesBox = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newIssueText, setNewIssueText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Load issues from localStorage on component mount
  useEffect(() => {
    const savedIssues = localStorage.getItem('vocabWordleIssues');
    if (savedIssues) {
      const parsedIssues = JSON.parse(savedIssues).map((issue: any) => ({
        ...issue,
        createdAt: new Date(issue.createdAt)
      }));
      setIssues(parsedIssues);
    }
  }, []);

  // Save issues to localStorage whenever issues change
  useEffect(() => {
    localStorage.setItem('vocabWordleIssues', JSON.stringify(issues));
  }, [issues]);

  const addIssue = () => {
    if (newIssueText.trim()) {
      const newIssue: Issue = {
        id: Date.now().toString(),
        text: newIssueText.trim(),
        completed: false,
        createdAt: new Date()
      };
      setIssues([...issues, newIssue]);
      setNewIssueText('');
    }
  };

  const deleteIssue = (id: string) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  const toggleIssue = (id: string) => {
    setIssues(issues.map(issue => 
      issue.id === id ? { ...issue, completed: !issue.completed } : issue
    ));
  };

  const startEditing = (issue: Issue) => {
    setEditingId(issue.id);
    setEditText(issue.text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      setIssues(issues.map(issue => 
        issue.id === id ? { ...issue, text: editText.trim() } : issue
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const clearCompleted = () => {
    setIssues(issues.filter(issue => !issue.completed));
  };

  const pendingIssues = issues.filter(issue => !issue.completed);
  const completedIssues = issues.filter(issue => issue.completed);

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Issues Tracker</h2>
        <div className="text-sm text-gray-400">
          {pendingIssues.length} pending, {completedIssues.length} completed
        </div>
      </div>

      {/* Add new issue */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newIssueText}
          onChange={(e) => setNewIssueText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addIssue()}
          placeholder="Describe an issue..."
          className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
        />
        <button
          onClick={addIssue}
          disabled={!newIssueText.trim()}
          className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Issues list */}
      <div className="space-y-3">
        {issues.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No issues tracked yet. Add one above to get started!
          </div>
        ) : (
          <>
            {/* Pending issues */}
            {pendingIssues.map((issue) => (
              <div key={issue.id} className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg">
                <button
                  onClick={() => toggleIssue(issue.id)}
                  className="w-6 h-6 rounded border-2 border-gray-500 hover:border-green-500 transition-colors flex items-center justify-center"
                >
                  {issue.completed && <Check size={16} className="text-green-500" />}
                </button>
                
                {editingId === issue.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(issue.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="flex-1 bg-gray-600 text-white px-2 py-1 rounded border border-gray-500 focus:border-purple-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(issue.id)}
                      className="text-green-400 hover:text-green-300"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span 
                      className={`flex-1 ${issue.completed ? 'text-gray-400 line-through' : 'text-white'}`}
                    >
                      {issue.text}
                    </span>
                    <button
                      onClick={() => startEditing(issue)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit size={16} />
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => deleteIssue(issue.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* Completed issues */}
            {completedIssues.map((issue) => (
              <div key={issue.id} className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-lg">
                <button
                  onClick={() => toggleIssue(issue.id)}
                  className="w-6 h-6 rounded border-2 border-green-500 transition-colors flex items-center justify-center bg-green-500"
                >
                  <Check size={16} className="text-white" />
                </button>
                
                <span className="flex-1 text-gray-400 line-through">
                  {issue.text}
                </span>
                
                <button
                  onClick={() => deleteIssue(issue.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Clear completed button */}
      {completedIssues.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={clearCompleted}
            className="text-sm text-gray-400 hover:text-white underline"
          >
            Clear {completedIssues.length} completed issue{completedIssues.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
};

export default IssuesBox;
