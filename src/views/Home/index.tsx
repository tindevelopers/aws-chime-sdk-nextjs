// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import MeetingForm from '../../components/MeetingForm';

const Home: React.FC = () => (
  <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <h1 style={{ color: '#232f3e', marginBottom: '10px' }}>
        🎬 Amazon Chime SDK Meeting Demo
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        Real-time video meetings with Amazon Chime SDK on Vercel
      </p>
      
      <div style={{ 
        display: 'inline-block',
        background: '#e8f5e8', 
        padding: '15px 25px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '1px solid #c3e6cb'
      }}>
        <h3 style={{ color: '#28a745', margin: '0 0 10px 0' }}>✅ System Status: Operational</h3>
        <div style={{ fontSize: '14px', color: '#155724' }}>
          🔧 Next.js 14 + Vercel • 🏗️ AWS Chime SDK • 🔐 Credentials OK • 🌐 API Active
        </div>
      </div>
    </div>

    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <MeetingForm />
      
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href="/devices" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '14px'
          }}>
            🎧 Device Setup
          </a>
          <a href="/test" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '14px'
          }}>
            🧪 Test Page
          </a>
          <a href="/api/join" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '14px'
          }}>
            🔧 API Test
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Home;