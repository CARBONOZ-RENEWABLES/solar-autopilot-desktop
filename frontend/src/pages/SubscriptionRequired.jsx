import React, { useEffect, useState } from 'react'
import './SubscriptionRequired.css'

export default function SubscriptionRequired() {
  const [features, setFeatures] = useState([
    'Full platform access',
    'SolarAutopilot integration',
    'Real-time monitoring',
    'Carbon intensity tracking',
    'Analytics & reports',
    'Priority support'
  ])

  useEffect(() => {
    fetch('https://login.carbonoz.com/api/v1/billing/plans')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data[0]?.features?.length > 0) {
          setFeatures(data.data[0].features)
        }
      })
      .catch(() => {})

    const bg = document.getElementById('animatedBg')
    if (bg) {
      for (let i = 0; i < 8; i++) {
        const solar = document.createElement('div')
        solar.className = 'solar-panel'
        solar.style.left = Math.random() * 100 + '%'
        solar.style.top = Math.random() * 100 + '%'
        solar.style.animationDelay = Math.random() * 6 + 's'
        bg.appendChild(solar)
        
        const battery = document.createElement('div')
        battery.className = 'battery'
        battery.style.left = Math.random() * 100 + '%'
        battery.style.top = Math.random() * 100 + '%'
        battery.style.animationDelay = Math.random() * 8 + 's'
        bg.appendChild(battery)
      }
    }
  }, [])

  return (
    <div className="subscription-page">
      <div className="animated-bg" id="animatedBg"></div>
      <div className="subscription-container">
        <div className="subscription-icon">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        
        <h1>Subscription Required</h1>
        
        <p>Your subscription has expired or is not active. Please subscribe to continue using CARBONOZ SolarAutopilot.</p>
        
        <div className="subscription-features">
          <div className="features-title">Included features:</div>
          <div>
            {features.map((feature, i) => (
              <div key={i} className="feature">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                {feature}
              </div>
            ))}
          </div>
        </div>
        
        <a
          href="https://login.carbonoz.com"
          target="_blank"
          rel="noopener noreferrer"
          className="subscription-btn"
        >
          Subscribe Now
          <svg viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
        
        <div className="subscription-footer">
          Already subscribed? The system will automatically reconnect within 5 minutes.
        </div>
      </div>
    </div>
  )
}
