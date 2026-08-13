import React, { useState, useEffect, useRef } from 'react';

export default function GuidedTour({ steps, isOpen, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const cardRef = useRef(null);
  const [cardStyle, setCardStyle] = useState({ opacity: 0 });

  const activeStep = steps[currentStepIndex];

  // Reset step index when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    }
  }, [isOpen]);

  // Update target rect when step index or screen layout changes
  useEffect(() => {
    if (!isOpen || !activeStep) return;

    const updatePosition = () => {
      if (!activeStep.target) {
        setTargetRect(null);
        // Center the tour card
        setCardStyle({
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 1,
          transition: 'all 0.3s ease'
        });
        return;
      }

      const element = document.querySelector(activeStep.target);
      if (element) {
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Wait a small moment for scroll to settle before measuring
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          setTargetRect({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
            viewportTop: rect.top,
            viewportLeft: rect.left
          });
        }, 150);
      } else {
        // Element not found, treat as centered modal
        setTargetRect(null);
        setCardStyle({
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 1,
          transition: 'all 0.3s ease'
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, currentStepIndex, activeStep]);

  // Position the tour card next to the highlighted element
  useEffect(() => {
    if (!isOpen || !activeStep || !targetRect) return;

    const card = cardRef.current;
    if (!card) return;

    const cardWidth = 340;
    const cardHeight = card.offsetHeight || 180;
    const gap = 16;
    const padding = 8; // overlay border padding

    let top = 0;
    let left = 0;

    const tTop = targetRect.viewportTop;
    const tLeft = targetRect.viewportLeft;
    const tWidth = targetRect.width;
    const tHeight = targetRect.height;

    const pos = activeStep.position || 'bottom';

    switch (pos) {
      case 'right':
        left = tLeft + tWidth + gap + padding;
        top = tTop + tHeight / 2 - cardHeight / 2;
        break;
      case 'left':
        left = tLeft - cardWidth - gap - padding;
        top = tTop + tHeight / 2 - cardHeight / 2;
        break;
      case 'top':
        left = tLeft + tWidth / 2 - cardWidth / 2;
        top = tTop - cardHeight - gap - padding;
        break;
      case 'bottom':
      default:
        left = tLeft + tWidth / 2 - cardWidth / 2;
        top = tTop + tHeight + gap + padding;
        break;
    }

    // Boundary check
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;

    if (left < gap) left = gap;
    if (left + cardWidth > viewWidth - gap) left = viewWidth - cardWidth - gap;
    if (top < gap) top = gap;
    if (top + cardHeight > viewHeight - gap) top = viewHeight - cardHeight - gap;

    setCardStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      opacity: 1,
      transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
    });
  }, [isOpen, targetRect, currentStepIndex, activeStep]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="tour-overlay">
      {/* Target Cutout Highlight */}
      {targetRect && (
        <div
          className="tour-overlay-cutout"
          style={{
            top: `${targetRect.top - 8}px`,
            left: `${targetRect.left - 8}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`
          }}
        />
      )}

      {/* Dimmer for Centered Modal (when no active cutout target) */}
      {!targetRect && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(3, 7, 18, 0.75)',
            pointerEvents: 'auto',
            zIndex: 99998
          }}
          onClick={onClose}
        />
      )}

      {/* Floating Card */}
      <div
        ref={cardRef}
        className="tour-card"
        style={cardStyle}
      >
        <div className="tour-card-header">
          <h3>{activeStep?.title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '18px',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>
        
        <div className="tour-card-body">
          {activeStep?.content}
        </div>

        <div className="tour-card-footer">
          <button className="tour-btn-skip" onClick={onClose}>
            Skip Tour
          </button>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className="tour-progress-dots" style={{ marginRight: '8px' }}>
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`tour-progress-dot ${idx === currentStepIndex ? 'active' : ''}`}
                />
              ))}
            </div>

            {currentStepIndex > 0 && (
              <button
                className="btn btn-secondary"
                onClick={handleBack}
                style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}
              >
                Back
              </button>
            )}

            <button
              className="tour-badge-action"
              onClick={handleNext}
            >
              {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
