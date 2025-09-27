import React, { useState, useEffect } from 'react';
import './App.css';
const PaymentDetailCard = ({ children, onClose, paymentStatus }) => {
    const cardClass = `payment-details-card ${paymentStatus === 'processing' ? 'processing' : ''}`;
    return (
        <div className={cardClass}>
            <button className="back-btn" onClick={onClose} disabled={paymentStatus === 'processing'}>&larr; Back</button>
            {children}
        </div>
    );
};
const UpiModalContent = ({ paymentStatus, onInitiatePayment }) => {
    const qrImages = [
        'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=example-one@upi',
        'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=example-two@upi'
    ];
    const [currentQrIndex, setCurrentQrIndex] = useState(0);
    const [countdown, setCountdown] = useState(5);
    const [isQrExpired, setIsQrExpired] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsQrExpired(true);
        }
    }, [countdown]);

    const handleRegenerate = () => {
        setCurrentQrIndex(prevIndex => (prevIndex + 1) % 2); // Toggles between 0 and 1
        setCountdown(5); // Reset timer
        setIsQrExpired(false);
    };

    return (
        <div className="modal-body">
            <h3>Pay with UPI</h3>
            <p>Scan the QR code with your favorite UPI app.</p>
            <div className="qr-code-wrapper">
                <div className="qr-code-container">
                    <img 
                        src={qrImages[currentQrIndex]} 
                        alt="UPI QR Code"
                        className={isQrExpired ? 'blurred' : ''}
                    />
                    {isQrExpired && (
                        <div className="regenerate-overlay">
                            <button onClick={handleRegenerate} className="regenerate-btn">Regenerate</button>
                        </div>
                    )}
                    {paymentStatus === 'processing' && <div className="scan-line"></div>}
                </div>
                {!isQrExpired && <div className="qr-timer">Expires in: {countdown}s</div>}
            </div>
            <p className="upi-id">or pay to <strong>example-upi@okhdfcbank</strong></p>

            <div className="payment-status-container">
                {paymentStatus === 'idle' && !isQrExpired && (
                    <button className="initiate-btn" onClick={onInitiatePayment}>
                        Initiate Dummy Payment
                    </button>
                )}
                {paymentStatus === 'processing' && <div className="loader">Processing...</div>}
            </div>
        </div>
    );
};

const CardModalContent = ({ paymentStatus, onInitiatePayment }) => {
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvc: ''
    });

    const isFormValid = cardDetails.cardNumber.length === 16 &&
                        cardDetails.cardName.trim() !== '' &&
                        /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate) &&
                        cardDetails.cvc.length === 3;

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setCardDetails(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="modal-body">
            <h3>Enter Card Details</h3>
            <form className="card-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" maxLength="16" value={cardDetails.cardNumber} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="cardName">Cardholder Name</label>
                    <input type="text" id="cardName" placeholder="John Doe" value={cardDetails.cardName} onChange={handleInputChange} />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="expiryDate">Expiry</label>
                        <input type="text" id="expiryDate" placeholder="MM/YY" maxLength="5" value={cardDetails.expiryDate} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cvc">CVC</label>
                        <input type="text" id="cvc" placeholder="123" maxLength="3" value={cardDetails.cvc} onChange={handleInputChange} />
                    </div>
                </div>
            </form>
           
            <div className="payment-status-container">
                 {paymentStatus === 'idle' && (
                    <button 
                        className="payment-animation-button" 
                        onClick={onInitiatePayment}
                        disabled={!isFormValid}
                    >
                        <div className="left-side">
                            <div className="card">
                                <div className="card-line"></div>
                                <div className="buttons"></div>
                            </div>
                            <div className="post">
                                <div className="post-line"></div>
                                <div className="screen">
                                    <div className="dollar">$</div>
                                </div>
                                <div className="numbers"></div>
                                <div className="numbers-line2"></div>
                            </div>
                        </div>
                        <div className="right-side">
                            <div className="new">Initiate Payment</div>
                            <svg viewBox="0 0 451.846 451.847" height="16" width="16" xmlns="http://www.w3.org/2000/svg" className="arrow"><path fill="#cfcfcf" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"></path></svg>
                        </div>
                    </button>
                )}
                {paymentStatus === 'processing' && <div className="loader">Processing...</div>}
            </div>
        </div>
    );
};
const SuccessToast = ({ onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000); // Auto-close after 4 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="toast-card">
            <svg className="wave" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z" fillOpacity="1"></path>
            </svg>
            <div className="icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" strokeWidth="0" fill="currentColor" stroke="currentColor" className="icon">
                    <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"></path>
                </svg>
            </div>
            <div className="message-text-container">
                <p className="message-text">Payment Successful</p>
                <p className="sub-text">Your transaction is complete.</p>
            </div>
            <svg onClick={onClose} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" strokeWidth="0" fill="none" stroke="currentColor" className="cross-icon">
                <path fill="currentColor" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
        </div>
    );
};
function App() {
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [detailView, setDetailView] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('idle');
    const [showToast, setShowToast] = useState(false);

    const handleSelection = (paymentType) => {
        setSelectedPayment(paymentType);
        setDetailView(paymentType);
    };
    
    const handleClose = () => {
        setDetailView(null);
        setSelectedPayment(null);
        setPaymentStatus('idle');
        setShowToast(false);
    };

    const handleInitiatePayment = () => {
        if (paymentStatus !== 'idle') return;
        
        if (detailView === 'card') {
            const btn = document.querySelector('.payment-animation-button');
            btn.classList.add('processing');
        }

        setPaymentStatus('processing');
        setTimeout(() => {
            setDetailView(null); // Hide the detail card
            setShowToast(true); // Show the toast
        }, 2500);
    };

    return (
        <>
            {showToast && <SuccessToast onClose={handleClose} />}
            <div className="app-wrapper">
                <div className={`payment-selector-container ${detailView ? 'blurred' : ''}`}>
                    <p className="title">Select a Payment Method</p>
                    <div className="options-wrapper">
                        <label className={`payment-option ${selectedPayment === 'upi' ? 'selected' : ''}`}>
                            <input type="radio" name="payment" value="upi" checked={selectedPayment === 'upi'} onChange={() => handleSelection('upi')} />
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR4ArUxtci1ip0bL0K9hs9QtwcJGy_gu9iYA&s" alt="UPI / GPay" />
                            <span>UPI / GPay</span>
                        </label>
                        <label className={`payment-option ${selectedPayment === 'card' ? 'selected' : ''}`}>
                            <input type="radio" name="payment" value="card" checked={selectedPayment === 'card'} onChange={() => handleSelection('card')} />
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-dSgR-_rcPP3h5DLZ_hvq5XA8UOhaD4AbFg&s" alt="Card Payment" />
                            <span>Card Payment</span>
                        </label>
                    </div>
                </div>

                {detailView && (
                    <PaymentDetailCard onClose={handleClose} paymentStatus={paymentStatus}>
                        {detailView === 'upi' ? 
                            <UpiModalContent paymentStatus={paymentStatus} onInitiatePayment={handleInitiatePayment} /> : 
                            <CardModalContent paymentStatus={paymentStatus} onInitiatePayment={handleInitiatePayment} />
                        }
                    </PaymentDetailCard>
                )}
            </div>
        </>
    );
}

export default App;