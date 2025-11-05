import React, { useState, useEffect } from 'react';

// Get the height of the header for the transition distance
const HEADER_HEIGHT = 80; 

const Scroll = () => {
    // State for Header (Vertical Hide/Show)
    const [headerTop, setHeaderTop] = useState(0); 
    
    // State for Section Movement (Horizontal Scroll Offset)
    const [scrollOffset, setScrollOffset] = useState(0);
    
    // Ref to store the last scroll position across renders
    const [lastScrollY, setLastScrollY] = useState(0); 
    
    // --- The Core Scroll Logic ---
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // 1. HEADER LOGIC (Vertical Hide/Show)
            const isScrollingDown = currentScrollY > lastScrollY;
            
            if (isScrollingDown && currentScrollY > HEADER_HEIGHT) {
                setHeaderTop(-HEADER_HEIGHT); 
            } else {
                setHeaderTop(0); 
            }

            // 2. SECTION LOGIC (Horizontal Slide/Offset)
            // Use the current scroll position to determine a movement offset.
            // A divisor (e.g., 5) controls the speed of the effect.
            // Adding a small constant (e.g., 50) creates an initial "hidden" position.
            // As currentScrollY increases, scrollOffset decreases, sliding the element right.
            const newOffset = 50 - (currentScrollY / 5); 
            setScrollOffset(newOffset);


            // 3. Update last known scroll position
            setLastScrollY(currentScrollY);
        };

        // Attach the event listener when the component mounts
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]); // Re-run effect only when lastScrollY changes

    // --- Inline Styles ---
    const pageStyles = {
        minHeight: '300vh', // Increased height for better effect demonstration
        paddingTop: `${HEADER_HEIGHT}px`,
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f8f8',
        padding: '20px',
    };

    const headerStyles = {
        position: 'fixed',
        top: `${headerTop}px`, // Vertical movement controlled by state
        left: 0,
        width: '100%',
        height: `${HEADER_HEIGHT}px`,
        backgroundColor: '#007bff',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 1000,
        transition: 'top 0.3s ease-out', 
    };

    // Style function for sections, including the horizontal transform effect
    const getSectionStyles = (initialOffset) => ({
        margin: '50px 0',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // --- KEY CHANGE: Horizontal movement via transform ---
        transform: `translateX(${scrollOffset}px)`, 
        opacity: 1 - (scrollOffset / 50), // Added opacity fade effect based on offset
        transition: 'opacity 0.5s ease-out', // Only transition opacity, let transform be direct
        willChange: 'transform, opacity', // Performance hint
    });
    
    // --- JSX Render ---
    return (
        <div style={pageStyles}>
            
            {/* The Smart Header (Hides/Shows vertically) */}
            <nav style={headerStyles}>
                <h2>React Smart Header (Vertical Hide)</h2>
            </nav>

            {/* Content Sections (Slide in Horizontally) */}
            <div style={getSectionStyles()}>
                <h3>Section 1: Horizontal Scroll Effect</h3>
                <p>Scroll down! This box will slide horizontally and fade in/out slightly based on your scroll position.</p>
            </div>
            
            <div style={getSectionStyles()}>
                <h3>Section 2: Continuous Movement</h3>
                <p>The movement is tied directly to the scroll position, creating a continuous parallax effect.</p>
            </div>

            <div style={getSectionStyles()}>
                <h3>Section 3: Customization</h3>
                <p>Change the `/ 5` divisor in the `handleScroll` function to make the effect slower or faster.</p>
            </div>
        </div>
    );
};

export default Scroll;