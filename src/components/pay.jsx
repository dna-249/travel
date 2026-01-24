import React from 'react';

const Pay = ({ invoiceAmount = '5000.00' }) => {
    
    // --- STATIC INSTITUTION BANK DETAILS ---
    const INSTITUTION_BANK_DETAILS = {
        bankName: "JAIZ BANK",
        accountName: "AT-TASFIYAH ISLAMIC INTERNATIONAL FOUNDATION ABUJA",
        accountNumber: "0016592164",
        referenceHint: " Send your reciepts through Whatsapp to 090121966277",
        currency: "NGN",
    };

    const primaryColor = '#0047AB'; // Dark Blue
    const accentColor = '#3b82f6'; // Light Blue
    const successColor = '#059669'; // Green

    return (
        <div className="payment-page-container">
            <style jsx>{`
                /* --- Base/Desktop Styling (Max-Width 450px) --- */
                .payment-page-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: #f3f4f6;
                    padding: 1rem;
                    font-family: Arial, sans-serif;
                }
                .details-card {
                    width: 100%;
                    max-width: 450px; 
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
                    padding: 32px;
                    border: 1px solid #e5e7eb;
                    text-align: center;
                }
                .logo-container {
                    margin-bottom: 24px;
                }
                .logo-container img {
                    height: 80px;
                    width: 80px;
                    object-fit: cover;
                    border-radius: 50%;
                    border: 2px solid ${accentColor};
                }
                .portal-title {
                    font-size: 1.5rem; /* Base size */
                    font-weight: 700;
                    margin-top: 12px;
                    color: ${primaryColor};
                }

                /* --- Details Section Styling --- */
                .transfer-header {
                    font-size: 1.25rem; /* Base size */
                    font-weight: 700;
                    margin-top: 0;
                    margin-bottom: 20px;
                    color: ${successColor};
                }
                .detail-item {
                    text-align: left;
                    margin-bottom: 16px;
                    padding: 12px;
                    border-radius: 8px;
                    background-color: #f3f4f6;
                    border: 1px solid #e5e7eb;
                }
                .detail-label {
                    display: block;
                    font-size: 0.8rem;
                    color: #6b7280;
                    margin-bottom: 4px;
                }
                .detail-value {
                    font-size: 1.1rem; /* Base size */
                    font-weight: 600;
                    color: ${primaryColor};
                    word-break: break-all;
                }
                .amount-box {
                    background-color: #fffbeb; 
                    border: 2px dashed #f59e0b;
                    padding: 16px;
                    margin-top: 16px;
                    margin-bottom: 24px;
                    border-radius: 8px;
                }
                .amount-box h3 {
                    margin: 0;
                    font-size: 1.25rem; /* Base size for amount */
                    font-weight: 600;
                    color: #92400e;
                }
                .footer-text {
                    text-align: center;
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin-top: 24px;
                }

                /* --- MOBILE OPTIMIZATION (Reduce Font Sizes on Smaller Screens) --- */
                @media (max-width: 640px) {
                    .details-card {
                        padding: 20px; /* Reduce padding on small screens */
                    }
                    .portal-title {
                        font-size: 1.3rem; /* Reduced from 1.5rem */
                    }
                    .transfer-header {
                        font-size: 1.1rem; /* Reduced from 1.25rem */
                    }
                    .detail-value {
                        font-size: 0.8rem; /* Reduced from 1.1rem */
                    }
                    .amount-box h3 {
                        font-size: 1.1rem; /* Reduced from 1.25rem */
                    }
                }
            `}</style>

            <div className="details-card">
                
                {/* 1. Logo and Title at the Top */}
                <div className="logo-container">
                    {/* Placeholder for the logo (must be served from a public path) */}
                    <img src="/aiiflogo.png"   style={{margin:'auto'}} width={80} height={80} alt="Institution Logo"/>
                    <h1 className="portal-title">
                        Pay Your Exam Fee
                    </h1>
                </div>

                <hr style={{marginBottom: '24px', border: 'none', borderTop: '1px solid #e5e7eb'}} />

                <h2 className="transfer-header">
                    Bank Transfer Details for Payment
                </h2>

                <div className="amount-box">
                    <h3>EXAM FEE: N {invoiceAmount}</h3>
                </div>
                
                {/* Bank Name */}
                <div className="detail-item">
                    <span className="detail-label">Bank Name</span>
                    <span className="detail-value">{INSTITUTION_BANK_DETAILS.bankName}</span>
                </div>

                {/* Account Name */}
                <div className="detail-item">
                    <span className="detail-label">Account Holder Name</span>
                    <span className="detail-value">{INSTITUTION_BANK_DETAILS.accountName}</span>
                </div>

                {/* Account Number */}
                <div className="detail-item">
                    <span className="detail-label">Account Number</span>
                    <span className="detail-value">{INSTITUTION_BANK_DETAILS.accountNumber}</span>
                </div>

                {/* Reference/Narration Hint */}
                <div className="detail-item" style={{backgroundColor: '#e0f2fe'}}>
                    <span className="detail-label" style={{color: primaryColor, fontWeight: 700}}>
                        IMPORTANT: Transfer Reference 
                    </span>
                    <span  className="detail-value" style={{fontSize: '0.7rem', color: '#eb1e1eff'}}>
                        {INSTITUTION_BANK_DETAILS.referenceHint}
                    </span>
                </div>

                <p className="footer-text">
                    Copy the details above and use your personal banking application to complete the transfer.
                </p>
            </div>
        </div>
    );
};

export default Pay;