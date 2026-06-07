import './index.css'
import React from 'react'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'
import ReactDOM from 'react-dom/client'
import FlowTrack from './FlowTrack.jsx'

if (Capacitor.isNativePlatform()) {
  StatusBar.setOverlaysWebView({ overlay: true });
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FlowTrack />
  </React.StrictMode>
)
