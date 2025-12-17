import Prescription from "../models/prescription.js";
import Patient from "../models/patient.js";
import User from "../models/user.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, symptoms, findings, medications, notes } = req.body;

    console.log("📥 Received data:", { patientId, doctorId, medications });

    // Validate medications
    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({ message: "At least one medication is required" });
    }

    const patient = await Patient.findById(patientId);
    const doctor = await User.findById(doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({ message: "Patient or Doctor not found" });
    }

    const newPrescription = new Prescription({
      patient: patientId,
      doctor: doctorId,
      symptoms,
      findings,
      medications,
      notes
    });

    const savedPrescription = await newPrescription.save();
    console.log("✅ Prescription saved:", savedPrescription._id);

    // Generate PDF
    const pdfDir = path.join("uploads");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

    const pdfPath = path.join(pdfDir, `prescription_${savedPrescription._id}.pdf`);

    const doc = new PDFDocument({ 
      margin: 40,
      size: 'A4'
    });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Professional Color Palette
    const colors = {
      primary: '#2E7D32',      // Medical Green
      secondary: '#1B5E20',    // Dark Green
      accent: '#4CAF50',       // Light Green
      text: '#212121',         // Almost Black
      textLight: '#757575',    // Gray
      border: '#E0E0E0',       // Light Gray
      headerBg: '#F1F8E9',     // Very Light Green
      tableBg: '#E8F5E9',      // Light Green Background
      white: '#FFFFFF'
    };

    // ═══════════════════════════════════════════════════════════
    // LETTERHEAD HEADER
    // ═══════════════════════════════════════════════════════════
    
    // Top colored bar
    doc.rect(0, 0, 612, 8).fill(colors.primary);
    
    // Header background box
    doc.rect(40, 20, 532, 110).fillAndStroke(colors.headerBg, colors.border);
    
    // Medical symbol with circle background
    doc.circle(306, 55, 25).fillAndStroke(colors.primary, colors.secondary);
    doc.fontSize(32).fillColor(colors.white).text('⚕', 290, 38);
    
    // Doctor's name - prominent
    doc.fontSize(26).font('Helvetica-Bold').fillColor(colors.secondary)
       .text(`Dr. ${doctor.name}`, 40, 90, { align: 'center', width: 532 });
    
    // Credentials line
    const credentials = `${doctor.degree || 'MBBS, MD'} | ${doctor.specialization || 'General Physician'}`;
    doc.fontSize(11).font('Helvetica').fillColor(colors.textLight)
       .text(credentials, 40, 118, { align: 'center', width: 532 });
    
    // Contact information with icons
    doc.fontSize(9).fillColor(colors.textLight);
    const contactLine = `Reg. No: ${doctor.licenseNumber || 'N/A'}  •  ${doctor.email}  •  ${doctor.phone || 'N/A'}`;
    doc.text(contactLine, 40, 135, { align: 'center', width: 532 });
    
    // Clinic address
    if (doctor.clinicAddress) {
      doc.fontSize(9).fillColor(colors.textLight)
         .text(`📍 ${doctor.clinicAddress}`, 40, 148, { align: 'center', width: 532 });
    }

    // ═══════════════════════════════════════════════════════════
    // PATIENT & DATE SECTION
    // ═══════════════════════════════════════════════════════════
    const patientSectionY = 175;
    
    // Patient info box
    doc.roundedRect(40, patientSectionY, 380, 70, 5)
       .fillAndStroke(colors.white, colors.border);
    
    // Date box (right side)
    doc.roundedRect(430, patientSectionY, 142, 70, 5)
       .fillAndStroke(colors.tableBg, colors.border);
    
    // Patient Details
    let detailY = patientSectionY + 12;
    doc.fontSize(9).font('Helvetica-Bold').fillColor(colors.textLight)
       .text('PATIENT INFORMATION', 50, detailY);
    
    detailY += 18;
    doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.text)
       .text('Name: ', 50, detailY);
    doc.font('Helvetica').fillColor(colors.text)
       .text(patient.name, 100, detailY);
    
    detailY += 15;
    doc.font('Helvetica-Bold').text('Age/Sex: ', 50, detailY);
    doc.font('Helvetica').text(`${patient.age || 'N/A'} Years / ${patient.gender || 'N/A'}`, 100, detailY);
    
    detailY += 15;
    doc.font('Helvetica-Bold').text('Contact: ', 50, detailY);
    doc.font('Helvetica').text(patient.phone || 'N/A', 100, detailY);
    
    // Date section
    const dateY = patientSectionY + 12;
    doc.fontSize(9).font('Helvetica-Bold').fillColor(colors.textLight)
       .text('DATE', 440, dateY, { align: 'center', width: 122 });
    
    doc.fontSize(16).font('Helvetica-Bold').fillColor(colors.primary)
       .text(new Date().getDate(), 440, dateY + 20, { align: 'center', width: 122 });
    
    const monthYear = new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    doc.fontSize(10).font('Helvetica').fillColor(colors.textLight)
       .text(monthYear, 440, dateY + 42, { align: 'center', width: 122 });

    // ═══════════════════════════════════════════════════════════
    // CLINICAL NOTES SECTION
    // ═══════════════════════════════════════════════════════════
    let currentY = 265;

    if (symptoms || findings) {
      // Section header
      doc.roundedRect(40, currentY, 532, 25, 3)
         .fillAndStroke(colors.tableBg, colors.border);
      
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.secondary)
         .text('CLINICAL NOTES', 50, currentY + 7);
      
      currentY += 35;
      
      if (symptoms) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.text)
           .text('Chief Complaints:', 50, currentY);
        currentY += 15;
        doc.fontSize(10).font('Helvetica').fillColor(colors.textLight)
           .text(symptoms, 50, currentY, { width: 512, align: 'justify', lineGap: 3 });
        currentY = doc.y + 12;
      }
      
      if (findings) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.text)
           .text('Diagnosis:', 50, currentY);
        currentY += 15;
        doc.fontSize(10).font('Helvetica').fillColor(colors.textLight)
           .text(findings, 50, currentY, { width: 512, align: 'justify', lineGap: 3 });
        currentY = doc.y + 12;
      }
      
      currentY += 10;
    }

    // ═══════════════════════════════════════════════════════════
    // PRESCRIPTION MEDICINES SECTION (℞)
    // ═══════════════════════════════════════════════════════════
    
    // Rx Header with gradient-like effect
    doc.roundedRect(40, currentY, 532, 40, 5)
       .fillAndStroke(colors.primary, colors.secondary);
    
    // Large Rx symbol
    doc.fontSize(30).font('Helvetica-Bold').fillColor(colors.white)
       .text('℞', 55, currentY + 8);
    
    // "PRESCRIPTION" text
    doc.fontSize(14).font('Helvetica-Bold').fillColor(colors.white)
       .text('PRESCRIPTION', 110, currentY + 13);
    
    currentY += 50;

    // Medicine table header
    doc.rect(40, currentY, 532, 28).fillAndStroke(colors.secondary, colors.secondary);
    
    doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.white);
    doc.text('#', 50, currentY + 9, { width: 25 });
    doc.text('MEDICINE NAME', 80, currentY + 9, { width: 180 });
    doc.text('DOSAGE', 270, currentY + 9, { width: 85 });
    doc.text('FREQUENCY', 365, currentY + 9, { width: 90 });
    doc.text('DURATION', 465, currentY + 9, { width: 95 });
    
    currentY += 28;

    // Medicines list with professional styling
    medications.forEach((med, index) => {
      // Check for page break
      if (currentY > 650) {
        doc.addPage({ margin: 40 });
        currentY = 60;
      }

      // Alternating row colors
      const rowBg = index % 2 === 0 ? colors.white : '#FAFAFA';
      const rowHeight = 40;
      
      doc.rect(40, currentY, 532, rowHeight).fillAndStroke(rowBg, colors.border);

      const textY = currentY + 12;
      
      // Serial number with circle
      doc.circle(62, textY + 6, 10).fillAndStroke(colors.accent, colors.accent);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.white)
         .text(`${index + 1}`, 56, textY + 2, { width: 12, align: 'center' });
      
      // Medicine name (bold and prominent)
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.text)
         .text(med.name, 80, textY, { width: 180 });
      
      // Dosage
      doc.fontSize(10).font('Helvetica').fillColor(colors.textLight)
         .text(med.dosage || '-', 270, textY, { width: 85 });
      
      // Frequency (highlighted)
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.primary)
         .text(med.frequency || '1-1-1', 365, textY, { width: 90 });
      
      // Duration
      doc.fontSize(10).font('Helvetica').fillColor(colors.textLight)
         .text(med.duration || '-', 465, textY, { width: 95 });
      
      // Instructions if available
      if (med.instructions) {
        doc.fontSize(8).font('Helvetica-Oblique').fillColor('#9E9E9E')
           .text(`Note: ${med.instructions}`, 80, textY + 18, { width: 480 });
      }

      currentY += rowHeight;
    });

    // ═══════════════════════════════════════════════════════════
    // ADDITIONAL INSTRUCTIONS
    // ═══════════════════════════════════════════════════════════
    if (notes) {
      currentY += 15;
      
      doc.roundedRect(40, currentY, 532, 20, 3)
         .fillAndStroke('#FFF3E0', '#FFB74D');
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#E65100')
         .text('⚠ IMPORTANT INSTRUCTIONS', 50, currentY + 5);
      
      currentY += 28;
      
      doc.roundedRect(40, currentY, 532, Math.max(50, doc.heightOfString(notes, { width: 502 }) + 20), 3)
         .fillAndStroke(colors.white, colors.border);
      
      doc.fontSize(10).font('Helvetica').fillColor(colors.text)
         .text(notes, 55, currentY + 10, { width: 502, align: 'justify', lineGap: 4 });
      
      currentY = doc.y + 20;
    }

    // ═══════════════════════════════════════════════════════════
    // FOOTER WITH SIGNATURE
    // ═══════════════════════════════════════════════════════════
    currentY = Math.max(currentY + 20, 640);
    
    // Divider line
    doc.moveTo(40, currentY).lineTo(572, currentY)
       .strokeColor(colors.border).lineWidth(1).stroke();
    
    currentY += 15;
    
    // Left side - General instructions
    doc.fontSize(8).font('Helvetica-Bold').fillColor(colors.text)
       .text('GENERAL INSTRUCTIONS:', 50, currentY);
    
    doc.fontSize(8).font('Helvetica').fillColor(colors.textLight)
       .text('• Take medicines as prescribed by the doctor', 50, currentY + 12, { lineGap: 2 })
       .text('• Complete the full course of medication', 50, currentY + 23, { lineGap: 2 })
       .text('• Consult immediately if symptoms worsen', 50, currentY + 34, { lineGap: 2 });
    
    // Right side - Doctor signature
    doc.fontSize(9).font('Helvetica-Oblique').fillColor(colors.textLight)
       .text("Doctor's Signature", 410, currentY);
    
    // Signature line
    doc.moveTo(410, currentY + 35).lineTo(560, currentY + 35)
       .strokeColor(colors.primary).lineWidth(2).stroke();
    
    // Doctor details below signature
    doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.secondary)
       .text(`Dr. ${doctor.name}`, 410, currentY + 40);
    
    doc.fontSize(9).font('Helvetica').fillColor(colors.textLight)
       .text(doctor.specialization || 'General Physician', 410, currentY + 54);
    
    doc.fontSize(8).fillColor(colors.textLight)
       .text(`Reg: ${doctor.licenseNumber || 'N/A'}`, 410, currentY + 66);

    // Bottom bar with disclaimer
    const bottomY = 760;
    doc.rect(0, bottomY, 612, 30).fill(colors.headerBg);
    doc.rect(0, bottomY, 612, 3).fill(colors.primary);
    
    doc.fontSize(7).font('Helvetica-Oblique').fillColor(colors.textLight)
       .text('This is a digitally generated prescription. For any queries, please contact the clinic.', 
             40, bottomY + 10, { align: 'center', width: 532 });

    doc.end();

    stream.on("finish", async () => {
      savedPrescription.pdfPath = pdfPath;
      await savedPrescription.save();

      return res.status(201).json({
        message: "Prescription saved and PDF generated successfully",
        prescription: savedPrescription
      });
    });

  } catch (error) {
    console.error("❌ Error creating prescription:", error);
    console.error("Error details:", error.message);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      details: error.toString()
    });
  }
};

export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    
    const prescriptions = await Prescription.find({ patient: patientId }).populate({
      path: 'doctor',
      select: 'name specialization licenseNumber'
    });
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};