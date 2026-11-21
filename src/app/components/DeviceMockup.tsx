"use client";

import { useEffect, useRef } from "react";

/**
 * Realistic 3D product shot built in HTML/CSS (no images, no WebGL):
 * an aluminium laptop showing a business website with Saim chatting in the
 * corner, and a phone in front receiving the lead. The scene tilts toward
 * the cursor and the chat/notification animate on a loop.
 * Styles live in globals.css under "Device mockup".
 */
export default function DeviceMockup({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    let frame = 0;
    let tx = 0;
    let ty = 0;
    const apply = () => {
      frame = 0;
      el.style.setProperty("--dm-ry", `${-16 + tx * 10}deg`);
      el.style.setProperty("--dm-rx", `${8 - ty * 6}deg`);
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={`dm-scene ${className}`} aria-label="Saim chatting with a visitor on a business website, and a new lead arriving on a phone" role="img">
      <div className="dm-stage">
        {/* Laptop */}
        <div className="dm-laptop">
          <div className="dm-lid">
            <div className="dm-bezel">
              <span className="dm-camera" />
              <div className="dm-screen">
                <div className="dm-browser">
                  <span className="dm-dot dm-red" />
                  <span className="dm-dot dm-yellow" />
                  <span className="dm-dot dm-green" />
                  <span className="dm-url">🔒 lekkihomes.ng</span>
                </div>
                <div className="dm-site">
                  <div className="dm-nav">
                    <span className="dm-logo">Lekki Homes</span>
                    <span className="dm-navlinks">Rent · Buy · Contact</span>
                  </div>
                  <div className="dm-hero">
                    <p className="dm-h">Find your next home in Lekki</p>
                    <p className="dm-sub">Verified apartments, no agent wahala.</p>
                    <span className="dm-cta">View listings</span>
                  </div>
                  <div className="dm-cards">
                    <div className="dm-card dm-c1"><span>3 bed · ₦4.2M/yr</span></div>
                    <div className="dm-card dm-c2"><span>2 bed · ₦2.8M/yr</span></div>
                    <div className="dm-card dm-c3"><span>Studio · ₦1.5M/yr</span></div>
                  </div>

                  {/* Saim widget */}
                  <div className="dm-widget">
                    <div className="dm-whead">
                      <span className="dm-avatar">S</span>
                      <span>
                        <b>Lekki Homes assistant</b>
                        <i>Online</i>
                      </span>
                    </div>
                    <div className="dm-wbody">
                      <p className="dm-msg dm-in dm-m1">Is the 3 bed still available?</p>
                      <p className="dm-msg dm-out dm-m2">Yes! ₦4.2M/yr, ready now. When would you like to move?</p>
                      <p className="dm-msg dm-in dm-m3">In 2 weeks</p>
                      <p className="dm-msg dm-out dm-m4">Great. What&apos;s your email? I&apos;ll book a viewing.</p>
                    </div>
                  </div>
                </div>
                <div className="dm-glare" />
              </div>
            </div>
          </div>
          <div className="dm-base">
            <span className="dm-notch" />
          </div>
          <div className="dm-shadow" />
        </div>

        {/* Phone */}
        <div className="dm-phone">
          <div className="dm-pframe">
            <div className="dm-pscreen">
              <span className="dm-island" />
              <p className="dm-time">9:41</p>
              <p className="dm-date">Saturday, 21 November</p>
              <div className="dm-notif">
                <span className="dm-napp">S</span>
                <div>
                  <p className="dm-ntitle">
                    Saim <em>now</em>
                  </p>
                  <p className="dm-ntext">🔥 New lead: Tunde A. · 3 bed · moving in 2 weeks</p>
                </div>
              </div>
              <div className="dm-glare" />
            </div>
          </div>
          <div className="dm-pshadow" />
        </div>
      </div>
    </div>
  );
}
