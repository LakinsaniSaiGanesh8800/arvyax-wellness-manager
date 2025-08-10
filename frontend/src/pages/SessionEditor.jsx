/* src/pages/SessionEditor.jsx */
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useToast } from '../components/toast'
import useDebouncedAutoSave from '../hooks/useDebouncedAutoSave'

import api from "../api/axiosInstance";

const saveDraft = async () => {
  try {
    const res = await api.post("/my-sessions/save-draft", {
      title: sessionTitle,
      json_file_url: sessionJsonUrl
    });
    console.log("Draft saved:", res.data);
  } catch (err) {
    console.error("Save draft failed:", err);
  }
};



export default function SessionEditor(){
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [jsonUrl, setJsonUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(()=>{
    if (!id) return
    setLoading(true)
    API.get(`/my-sessions/${id}`).then(r=>{
      const s = r.data
      setTitle(s.title)
      setTags((s.tags||[]).join(', '))
      setJsonUrl(s.json_file_url||'')
    }).catch(e=>toast.add('Unable to load')).finally(()=>setLoading(false))
  },[id])

  // auto-save when any of these change
  useDebouncedAutoSave({ title, tags, jsonUrl }, async () => {
    // only auto-save if there is a title
    if (!title || title.trim().length < 3) return
    setSaving(true)
    try {
      const payload = { id, title, tags, json_file_url: jsonUrl }
      const res = await API.post('/my-sessions/save-draft', payload)
      // if created, update URL
      if (res.data?.session?._id && !id) {
        navigate(`/editor/${res.data.session._id}`, { replace: true })
      }
      toast.add('Draft auto-saved')
    } catch (err) {
      console.error(err)
      toast.add('Auto-save failed')
    } finally { setSaving(false) }
  }, 5000)

  async function handleSave(e){
    e?.preventDefault?.()
    setSaving(true)
    try{
      const res = await API.post('/my-sessions/save-draft', { id, title, tags, json_file_url: jsonUrl })
      toast.add('Draft saved')
      if (res.data?.session?._id && !id) navigate(`/editor/${res.data.session._id}`, { replace: true })
    }catch(err){ toast.add(err.response?.data?.message || 'Save failed') }
    finally{ setSaving(false) }
  }

  async function handlePublish(){
    if (!title || title.trim().length < 3) { toast.add('Title required') ; return }
    setSaving(true)
    try{
      await API.post('/my-sessions/publish', { id, title, tags, json_file_url: jsonUrl })
      toast.add('Published')
      navigate('/my-sessions')
    }catch(err){ toast.add(err.response?.data?.message || 'Publish failed') }
    finally{ setSaving(false) }
  }



  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{id ? 'Edit Session' : 'Create Session'}</h2>
        <div className="text-sm text-slate-500">{saving ? 'Saving...' : 'Saved'}</div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-2 border rounded mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium">Tags (comma-separated)</label>
          <input value={tags} onChange={e=>setTags(e.target.value)} className="w-full p-2 border rounded mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium">JSON File URL</label>
          <input value={jsonUrl} onChange={e=>setJsonUrl(e.target.value)} className="w-full p-2 border rounded mt-1" />
        </div>

        <div className="flex items-center space-x-2">
          <button type="submit" className="bg-slate-600 text-white px-4 py-2 rounded">Save Draft</button>
          <button type="button" onClick={handlePublish} className="bg-emerald-600 text-white px-4 py-2 rounded">Publish</button>
          <button type="button" onClick={()=>{ localStorage.removeItem('token'); window.location.href = '/login' }} className="ml-auto text-sm text-rose-600">Logout</button>
        </div>
      </form>
    </div>
  )
}


