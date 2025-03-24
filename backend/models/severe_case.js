import mongoose from "mongoose";

const severeCaseSchema = new mongoose.Schema({
    is_active: { type: Boolean, required: true, default: true },
    assigned_patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    created_at: { type: Date, default: Date.now },
    ended_at: { type: Date, default: null } // Nullable, updated when the case is resolved
});

const SevereCase = mongoose.model("SevereCase", severeCaseSchema);
export default SevereCase;