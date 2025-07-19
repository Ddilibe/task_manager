import "../styles/FloatingModal.css";

interface FloatingModelProp {
    children: any;
    onClose: any;
}

export function FloatingModal({ children, onClose }: FloatingModelProp) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="mt-2 bg-pink" onCanPlayCapture={onClose}>{children}</div>
                {/* <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    ✖
                </button> */}
            </div>
        </div>
    );
}