import React from 'react';
import './BehindTheDesign.css';

export default function BehindTheDesign() {
  return (
    <div className="behind-design-page animate-fadeIn">
      {/* Page Header */}
      <div className="behind-header xp-panel mb-16">
        <div className="xp-panel__header header-accent">
          <span>📖</span>
          Behind the Design — Hinge 2006
        </div>
        <div className="xp-panel__body">
          <h2>An Alternate-History Product Study</h2>
          <p className="subtitle-design">How we re-engineered Hinge's modern matching core for 2006 desktop constraints, design languages, and system resources.</p>
        </div>
      </div>

      <div className="behind-grid">
        {/* Core Rationale Sections */}
        <div className="rationales-container">
          
          {/* Rationale 1 */}
          <div className="xp-panel mb-12">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">🔄</span>
              Why No Swiping? (Directory Browsing)
            </div>
            <div className="xp-panel__body">
              <p className="rationale-text">
                In 2006, the primary computing platform was the desktop PC with a <strong>CRT or early LCD monitor</strong>. The mouse and keyboard were the only inputs. Touch screens and trackpad swipe gestures did not exist.
              </p>
              <div className="xp-divider" />
              <p className="rationale-implication text-primary text-bold">
                💡 Replaced by: The Member Directory and Pagination
              </p>
              <p className="rationale-explanation">
                Instead of card decks, users browse profiles in a grid directory using filter drop-downs and explicit page clicks. This mirrors early <strong>Orkut people search</strong> and <strong>Yahoo! Personals</strong>. Infinite scrolling was not viable because AJAX (async data fetching) was in its infancy.
              </p>
            </div>
          </div>

          {/* Rationale 2 */}
          <div className="xp-panel mb-12">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">🤖</span>
              Why is AI Hidden? (The Hinge Match Assistant)
            </div>
            <div className="xp-panel__body">
              <p className="rationale-text">
                Artificial Intelligence did not have modern chat interfaces like ChatGPT in 2006. Consumer software presented automated helpers as localized companion agents, such as <strong>Microsoft Office Clippy</strong> or <strong>MSN Messenger bots</strong>.
              </p>
              <div className="xp-divider" />
              <p className="rationale-implication text-primary text-bold">
                💡 Replaced by: MatchBot Popup Alerts
              </p>
              <p className="rationale-explanation">
                The AI features (Compatibility Score, Conversation Starter, and Fake Profile Detection) are hidden behind a skeuomorphic Windows XP system tray pop-up. The assistant analyzes user scrapbooks locally, offering trust scores and icebreakers inside a speech bubble.
              </p>
            </div>
          </div>

          {/* Rationale 3 */}
          <div className="xp-panel mb-12">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">💬</span>
              MSN/Yahoo Messenger Integration
            </div>
            <div className="xp-panel__body">
              <p className="rationale-text">
                Dating apps today use built-in mobile chats. In 2006, the dominant chat paradigm was instant messaging software. Users would add matches to their buddy list and launch separate windows.
              </p>
              <div className="xp-divider" />
              <p className="rationale-implication text-primary text-bold">
                💡 Replaced by: Messenger Chat Windows & Nudges
              </p>
              <p className="rationale-explanation">
                We rebuilt the chat interface to resemble <strong>Yahoo Messenger 8.0</strong>, featuring pixel-art emoticons, typing status lines, and the legendary <strong>"BUZZ!!!" (nudge)</strong> shake animation and sound.
              </p>
            </div>
          </div>

          {/* Rationale 4 */}
          <div className="xp-panel">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">📬</span>
              No Mobile Push Notifications (Email Alerts)
            </div>
            <div className="xp-panel__body">
              <p className="rationale-text">
                Smartphones and instant push notifications did not exist. Users checked for updates by signing into their desktop emails or waiting for notification balloons to trigger on their Windows system tray.
              </p>
              <div className="xp-divider" />
              <p className="rationale-implication text-primary text-bold">
                💡 Replaced by: System Tray Balloons & Email Preferences
              </p>
              <p className="rationale-explanation">
                Users are notified of matches via email configuration tabs in the Hinge Control Panel, alongside XP balloon popup sounds when they are online.
              </p>
            </div>
          </div>

        </div>

        {/* Right Side design details */}
        <div className="behind-design-side">
          <div className="xp-panel mb-12">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">🎨</span>
              2006 Aesthetic Elements
            </div>
            <div className="xp-panel__body">
              <table className="retro-details-table">
                <thead>
                  <tr>
                    <th>Element</th>
                    <th>2006 Choice</th>
                    <th>Inspiration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Fonts</strong></td>
                    <td>Tahoma / Segoe UI</td>
                    <td>Windows XP / Vista</td>
                  </tr>
                  <tr>
                    <td><strong>Buttons</strong></td>
                    <td>Aqua gradients, beveled 3D</td>
                    <td>OS X Aqua / Luna</td>
                  </tr>
                  <tr>
                    <td><strong>Colors</strong></td>
                    <td>Luna Blue / Aero Silver</td>
                    <td>Windows Default theme</td>
                  </tr>
                  <tr>
                    <td><strong>Icons</strong></td>
                    <td>Glow highlights, pixel-art</td>
                    <td>IE6 Toolbar</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="xp-panel">
            <div className="xp-panel__header">
              <span className="xp-panel__header-icon">🛡️</span>
              Technical Specifications
            </div>
            <div className="xp-panel__body">
              <ul className="spec-bullet-list">
                <li><strong>Target Resolution:</strong> Optimized for 1024×768 CRT displays.</li>
                <li><strong>Layout Model:</strong> Fixed-width containers (no modern flex-grid wraps).</li>
                <li><strong>Gradients:</strong> Skeuomorphic gradients indicating depth and light sources.</li>
                <li><strong>Borders:</strong> High-contrast beveled edges representing clickable components.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
