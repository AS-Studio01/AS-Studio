(function() {
  'use strict';

  const isReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', function() {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const dashWrapper = document.querySelector('.dashboard-wrapper');
  const dashTilt = document.querySelector('.dashboard-tilt');

  if (dashWrapper && dashTilt) {
    let rafId = null;

    dashWrapper.addEventListener('mousemove', function(e) {
      if (isReduced() || window.innerWidth < 992) return;
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(function() {
        const rect = dashWrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotX = (-y * 6).toFixed(2);
        const rotY = (x * 7).toFixed(2);
        dashTilt.style.transform = 'perspective(1200px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
      });
    });

    dashWrapper.addEventListener('mouseleave', function() {
      if (rafId) cancelAnimationFrame(rafId);
      dashTilt.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });
  }

  const dashData = {
    overview: {
      metrics: [
        { label: 'Event Ingress', val: '1.82M', change: '+14.2% / sec' },
        { label: 'Mean Latency', val: '3.8ms', change: '-0.6ms p95' },
        { label: 'Synthesized Graph', val: '99.98%', change: 'Zero drop' },
        { label: 'Edge Replicas', val: '128', change: 'All healthy' }
      ],
      chartPath: 'M0,130 C40,115 80,140 120,95 C160,50 200,80 240,45 C280,10 320,60 360,25 C400,-10 440,30 480,15 C520,0 560,40 600,10',
      fillPath: 'M0,130 C40,115 80,140 120,95 C160,50 200,80 240,45 C280,10 320,60 360,25 C400,-10 440,30 480,15 C520,0 560,40 600,10 L600,160 L0,160 Z',
      barHeights: [38, 54, 78, 62, 92, 110, 85, 96, 120, 105, 130, 142],
      donutDash: '188 62',
      tableRows: [
        { node: 'edge-iad-01', loc: 'US-East (Virginia)', stat: 'healthy', lat: '1.2ms', tps: '482k/s' },
        { node: 'edge-fra-04', loc: 'EU-Central (Frankfurt)', stat: 'healthy', lat: '2.4ms', tps: '394k/s' },
        { node: 'edge-sin-02', loc: 'AP-East (Singapore)', stat: 'healthy', lat: '3.1ms', tps: '512k/s' },
        { node: 'edge-hnd-03', loc: 'AP-Northeast (Tokyo)', stat: 'healthy', lat: '2.9ms', tps: '430k/s' }
      ]
    },
    humanoid: {
      metrics: [
        { label: 'Cognitive Latency', val: '0.28ms', change: 'Zero perceptual lag' },
        { label: 'Reasoning Bandwidth', val: '4.82B', change: 'Tokens/s synthesis' },
        { label: 'Human Oversight', val: '100%', change: 'Continuous HITL verified' },
        { label: 'Empathic Alignment', val: '99.9%', change: 'Humane guardrails active' }
      ],
      chartPath: 'M0,120 C50,90 100,130 150,70 C200,30 250,95 300,50 C350,15 400,60 450,30 C500,10 550,45 600,18',
      fillPath: 'M0,120 C50,90 100,130 150,70 C200,30 250,95 300,50 C350,15 400,60 450,30 C500,10 550,45 600,18 L600,160 L0,160 Z',
      barHeights: [45, 60, 88, 110, 135, 120, 95, 140, 130, 150, 125, 145],
      donutDash: '235 15',
      tableRows: [
        { node: 'cortex-hitl-01', loc: 'Empathic Alignment Core', stat: 'healthy', lat: '0.18ms', tps: '1.2M/s' },
        { node: 'cortex-synapse-02', loc: 'Frontal Hypergraph Mesh', stat: 'healthy', lat: '0.22ms', tps: '980k/s' },
        { node: 'cortex-ocular-03', loc: 'Visual Vector Spatializer', stat: 'healthy', lat: '0.29ms', tps: '1.4M/s' },
        { node: 'cortex-ethics-04', loc: 'Humane Safety Invariants', stat: 'healthy', lat: '0.12ms', tps: '640k/s' }
      ]
    },
    queries: {
      metrics: [
        { label: 'Active Streams', val: '84.6K', change: '+8.1% vs 1h' },
        { label: 'P50 Latency', val: '0.8ms', change: 'Sub-millisecond' },
        { label: 'Cache Hit Rate', val: '99.4%', change: '+0.3% warm' },
        { label: 'Query Index', val: '16.4TB', change: 'Vectorized' }
      ],
      chartPath: 'M0,140 C50,130 90,85 140,80 C190,75 230,110 280,60 C330,10 380,45 430,35 C480,25 530,70 600,20',
      fillPath: 'M0,140 C50,130 90,85 140,80 C190,75 230,110 280,60 C330,10 380,45 430,35 C480,25 530,70 600,20 L600,160 L0,160 Z',
      barHeights: [65, 72, 85, 90, 115, 128, 98, 104, 138, 122, 144, 150],
      donutDash: '210 40',
      tableRows: [
        { node: 'query-exec-09', loc: 'Distributed Vector', stat: 'healthy', lat: '0.6ms', tps: '210k/s' },
        { node: 'query-exec-12', loc: 'Memory Partition A', stat: 'healthy', lat: '0.9ms', tps: '185k/s' },
        { node: 'query-exec-15', loc: 'Memory Partition B', stat: 'healthy', lat: '0.7ms', tps: '192k/s' },
        { node: 'query-exec-21', loc: 'Index Rebalance', stat: 'healthy', lat: '1.1ms', tps: '259k/s' }
      ]
    },
    alerts: {
      metrics: [
        { label: 'Active Anomaly', val: '0', change: 'Zero critical' },
        { label: 'Heuristic Drift', val: '0.02%', change: 'Within bounds' },
        { label: 'Auto Healed', val: '42', change: 'Last 24h' },
        { label: 'Route Redundancy', val: '3x', change: 'Active-Active' }
      ],
      chartPath: 'M0,150 C60,145 120,130 180,120 C240,110 300,125 360,90 C420,55 480,85 540,40 C570,20 590,35 600,30',
      fillPath: 'M0,150 C60,145 120,130 180,120 C240,110 300,125 360,90 C420,55 480,85 540,40 C570,20 590,35 600,30 L600,160 L0,160 Z',
      barHeights: [20, 25, 30, 22, 45, 35, 18, 28, 38, 24, 30, 15],
      donutDash: '240 10',
      tableRows: [
        { node: 'guard-route-01', loc: 'Anomaly Heuristic', stat: 'healthy', lat: '0.4ms', tps: '98k/s' },
        { node: 'guard-route-02', loc: 'Memory Sentinel', stat: 'healthy', lat: '0.3ms', tps: '112k/s' },
        { node: 'guard-route-03', loc: 'Egress Rate Guard', stat: 'healthy', lat: '0.5ms', tps: '84k/s' },
        { node: 'guard-route-04', loc: 'TLS Pipeline Sync', stat: 'healthy', lat: '0.4ms', tps: '106k/s' }
      ]
    }
  };

  function updateDashboard(tabKey) {
    const data = dashData[tabKey];
    if (!data) return;

    const metricCards = document.querySelectorAll('.metrics-strip .metric-card');
    data.metrics.forEach((m, idx) => {
      if (metricCards[idx]) {
        const valEl = metricCards[idx].querySelector('.metric-val');
        const chgEl = metricCards[idx].querySelector('.metric-change');
        if (valEl) valEl.textContent = m.val;
        if (chgEl) chgEl.textContent = m.change;
      }
    });

    const linePath = document.querySelector('.svg-chart .line-draw');
    const fillPath = document.querySelector('.svg-chart .fill-area');
    if (linePath && fillPath) {
      linePath.setAttribute('d', data.chartPath);
      fillPath.setAttribute('d', data.fillPath);
      if (!isReduced()) {
        linePath.style.animation = 'none';
        void linePath.offsetHeight;
        linePath.style.animation = 'draw-chart 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      }
    }

    const bars = document.querySelectorAll('.svg-bars rect');
    data.barHeights.forEach((h, idx) => {
      if (bars[idx]) {
        const yPos = 160 - h;
        bars[idx].setAttribute('height', String(h));
        bars[idx].setAttribute('y', String(yPos));
      }
    });

    const donutCircle = document.querySelector('.donut-circle-fg');
    if (donutCircle) {
      donutCircle.setAttribute('stroke-dasharray', data.donutDash);
    }

    const tbody = document.querySelector('.dash-table tbody');
    if (tbody) {
      tbody.innerHTML = '';
      data.tableRows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td><span class="node-status-dot" style="background:#10b981"></span>' + row.node + '</td>' +
                       '<td>' + row.loc + '</td>' +
                       '<td>' + row.lat + '</td>' +
                       '<td>' + row.tps + '</td>';
        tbody.appendChild(tr);
      });
    }
  }

  const dashTabs = document.querySelectorAll('.dash-tab');
  dashTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      dashTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      updateDashboard(tab.getAttribute('data-tab'));
    });

    tab.addEventListener('keydown', function(e) {
      const tabsArray = Array.from(dashTabs);
      const index = tabsArray.indexOf(tab);
      let targetTab = null;

      if (e.key === 'ArrowRight') {
        targetTab = tabsArray[(index + 1) % tabsArray.length];
      } else if (e.key === 'ArrowLeft') {
        targetTab = tabsArray[(index - 1 + tabsArray.length) % tabsArray.length];
      } else if (e.key === 'Home') {
        targetTab = tabsArray[0];
      } else if (e.key === 'End') {
        targetTab = tabsArray[tabsArray.length - 1];
      }

      if (targetTab) {
        e.preventDefault();
        targetTab.focus();
        targetTab.click();
      }
    });
  });

  const featCards = document.querySelectorAll('.feat-card');
  featCards.forEach(card => {
    card.addEventListener('pointermove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  const dataflowPath = document.querySelector('.dataflow-path');
  const featSection = document.querySelector('.feature-section');

  if (dataflowPath && featSection) {
    if (isReduced()) {
      dataflowPath.style.strokeDashoffset = '0';
    } else {
      const updateDataflow = () => {
        const rect = featSection.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height + vh;
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / total));
        const offset = (1 - progress) * 1200;
        dataflowPath.style.strokeDashoffset = String(Math.round(offset));
      };

      window.addEventListener('scroll', updateDataflow, { passive: true });
      updateDataflow();
    }
  }

  const billingToggle = document.querySelector('.toggle-switch');
  const devPrice = document.querySelector('.dev-price-num');
  const entPrice = document.querySelector('.ent-price-num');
  const billPeriods = document.querySelectorAll('.tier-period');

  if (billingToggle && devPrice && entPrice) {
    const handleToggle = () => {
      const isYearly = billingToggle.getAttribute('aria-checked') === 'true';
      const nextState = !isYearly;
      billingToggle.setAttribute('aria-checked', String(nextState));

      if (nextState) {
        devPrice.textContent = '$39';
        entPrice.textContent = '$279';
        billPeriods.forEach(p => p.textContent = '/ month, billed yearly');
      } else {
        devPrice.textContent = '$49';
        entPrice.textContent = '$349';
        billPeriods.forEach(p => p.textContent = '/ month');
      }
    };

    billingToggle.addEventListener('click', handleToggle);
    billingToggle.addEventListener('keydown', function(e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleToggle();
      }
    });
  }

  const countElements = document.querySelectorAll('[data-count]');
  if (countElements.length) {
    if (isReduced()) {
      countElements.forEach(el => {
        el.textContent = el.getAttribute('data-count');
      });
    } else {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            obs.unobserve(el);
            const targetVal = parseFloat(el.getAttribute('data-count'));
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            const duration = 1200;
            const start = performance.now();

            function frame(now) {
              const elapsed = now - start;
              const progress = Math.min(1, elapsed / duration);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = (targetVal * eased).toFixed(targetVal % 1 === 0 ? 0 : 2);
              el.textContent = prefix + current + suffix;
              if (progress < 1) {
                requestAnimationFrame(frame);
              } else {
                el.textContent = prefix + targetVal + suffix;
              }
            }

            requestAnimationFrame(frame);
          }
        });
      }, { threshold: 0.2 });

      countElements.forEach(el => observer.observe(el));
    }
  }

  const termTabs = document.querySelectorAll('.term-tab');
  const termOutput = document.getElementById('term-output');
  const termCommands = {
    stream: [
      { prompt: '$ delta stream --cluster=edge-global --p99 < 2ms' },
      { time: '[01:14:02.108]', tag: 'INGRESS', type: 'term-ok', text: '2,410,290 ev/s via eBPF ring_buffer on core#7 [ZERO_DROP]' },
      { time: '[01:14:02.109]', tag: 'SYNTH', type: 'term-synth', text: 'Hypergraph causality resolved in 0.38ms across 128 edge nodes' },
      { time: '[01:14:02.110]', tag: 'QUORUM', type: 'term-ok', text: 'Raft commit term=4219 idx=8091819 latency=0.72ms' }
    ],
    trace: [
      { prompt: '$ delta trace --span=ingest-p99 --sample=100k' },
      { time: '[01:14:02.214]', tag: 'SPAN', type: 'term-synth', text: 'Trace ID: 7a8f9021b8c14e00 · 8 hops mapped' },
      { time: '[01:14:02.215]', tag: 'PROFILE', type: 'term-ok', text: 'SIMD AVX-512 vector scan: 48.2 GB/s memory bandwidth' },
      { time: '[01:14:02.216]', tag: 'CASCADE', type: 'term-ok', text: 'Zero lock contention on memory partition A [PASSED]' }
    ],
    quorum: [
      { prompt: '$ delta mesh health --nodes=128 --status=synced' },
      { time: '[01:14:02.341]', tag: 'MESH', type: 'term-ok', text: '128 / 128 edge nodes healthy · QUIC TLS 1.3 verified' },
      { time: '[01:14:02.342]', tag: 'TPM', type: 'term-synth', text: 'Hardware TPM 2.0 signatures valid on all ingress blocks' },
      { time: '[01:14:02.343]', tag: 'LATENCY', type: 'term-ok', text: 'Mean inter-region sync: 1.8ms (IAD-FRA-SIN-HND)' }
    ]
  };

  if (termTabs.length && termOutput) {
    termTabs.forEach(t => {
      t.addEventListener('click', function() {
        termTabs.forEach(tb => tb.classList.remove('active'));
        t.classList.add('active');
        const cmdKey = t.getAttribute('data-cmd');
        const lines = termCommands[cmdKey] || termCommands.stream;
        let html = '<div class="term-line"><span class="term-dim">$</span> <span>' + lines[0].prompt.slice(2) + '</span></div>';
        for (let i = 1; i < lines.length; i++) {
          html += '<div class="term-line"><span class="term-time">' + lines[i].time + '</span> <span class="' + lines[i].type + '">' + lines[i].tag + '</span> <span>' + lines[i].text + '</span></div>';
        }
        termOutput.innerHTML = html;
      });
    });
  }

  /* Humanoid Neural Operator: Interactive Gaze Tracking */
  const cockpit = document.getElementById('humanoidCockpit');
  const leftPupil = document.getElementById('leftPupil');
  const rightPupil = document.getElementById('rightPupil');

  if (cockpit && leftPupil && rightPupil) {
    cockpit.addEventListener('mousemove', function(e) {
      if (isReduced()) return;
      const rect = cockpit.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      const offsetX = Math.max(-5, Math.min(5, nx * 10));
      const offsetY = Math.max(-4, Math.min(4, ny * 8));

      leftPupil.setAttribute('cx', String(90 + offsetX));
      leftPupil.setAttribute('cy', String(116 + offsetY));
      rightPupil.setAttribute('cx', String(150 + offsetX));
      rightPupil.setAttribute('cy', String(116 + offsetY));
    });

    cockpit.addEventListener('mouseleave', function() {
      leftPupil.setAttribute('cx', '90');
      leftPupil.setAttribute('cy', '116');
      rightPupil.setAttribute('cx', '150');
      rightPupil.setAttribute('cy', '116');
    });
  }

  /* Humanoid Operator: HITL Oversight Switch */
  const hitlBtn = document.getElementById('hitlToggle');
  const hitlTxt = document.getElementById('hitlTxt');
  const imLat = document.getElementById('imCognitiveLat');
  const imGuard = document.getElementById('imGuardrail');

  if (hitlBtn && hitlTxt) {
    let isHitlActive = true;
    hitlBtn.addEventListener('click', function() {
      isHitlActive = !isHitlActive;
      hitlBtn.setAttribute('aria-pressed', String(isHitlActive));
      hitlBtn.classList.toggle('autonomous', !isHitlActive);
      if (isHitlActive) {
        hitlTxt.textContent = '100% Synced (HITL)';
        if (imLat) imLat.textContent = '0.28 ms';
        if (imGuard) { imGuard.textContent = 'Active'; imGuard.style.color = '#10b981'; }
      } else {
        hitlTxt.textContent = 'Autonomous Turbo (HITL Standby)';
        if (imLat) imLat.textContent = '0.14 ms';
        if (imGuard) { imGuard.textContent = 'Continuous'; imGuard.style.color = '#00f2fe'; }
      }
    });
  }

  /* Humanoid Thought Stream: Ambient Log Pulses */
  const thoughtStream = document.getElementById('humanoidThoughtStream');
  if (thoughtStream && !isReduced()) {
    const thoughts = [
      { tag: 'SYNTH', type: 'tag-synth', text: 'Analyzing ingress telemetry vector across Singapore & Tokyo clusters: zero jitter detected.' },
      { tag: 'HITL', type: 'tag-hitl', text: 'Human oversight invariant satisfied: automated node failover cleared for cluster:fra-04.' },
      { tag: 'ETHICS', type: 'tag-safe', text: 'Differential privacy noise injected into outbound metric aggregates; telemetry payload clean.' },
      { tag: 'CORTEX', type: 'tag-synth', text: 'Frontal neural graph synchronized 128 replicas in 0.38ms [Consensus Reached].' },
      { tag: 'REASON', type: 'tag-hitl', text: 'Synthesizing root-cause prediction for upstream BGP flap; alternate paths armed.' }
    ];
    let thoughtIdx = 0;
    setInterval(() => {
      const t = thoughts[thoughtIdx % thoughts.length];
      thoughtIdx++;
      const now = new Date();
      const timeStr = '[' + [now.getHours(), now.getMinutes(), now.getSeconds()].map(v => String(v).padStart(2, '0')).join(':') + '.' + String(now.getMilliseconds()).padStart(3, '0') + ']';
      const row = document.createElement('div');
      row.className = 'log-entry';
      row.innerHTML = '<span class="log-time">' + timeStr + '</span> <span class="log-tag ' + t.type + '">' + t.tag + '</span> <span>' + t.text + '</span>';
      thoughtStream.appendChild(row);
      if (thoughtStream.children.length > 5) {
        thoughtStream.removeChild(thoughtStream.firstElementChild);
      }
    }, 7000);
  }
})();

