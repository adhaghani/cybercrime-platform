-- Trigger to automatically create CRIME or FACILITY record after REPORT creation
CREATE OR REPLACE TRIGGER trg_report_ai
AFTER INSERT ON REPORT
FOR EACH ROW
BEGIN
    IF :NEW.TYPE = 'CRIME' THEN
        -- Insert placeholder - will be updated later with actual crime details
        INSERT INTO CRIME (REPORT_ID, CRIME_CATEGORY)
        VALUES (:NEW.REPORT_ID, 'OTHER');
    ELSIF :NEW.TYPE = 'FACILITY' THEN
        -- Insert placeholder - will be updated later with actual facility details
        INSERT INTO FACILITY (REPORT_ID, FACILITY_TYPE, SEVERITY_LEVEL)
        VALUES (:NEW.REPORT_ID, 'OTHER', 'LOW');
    END IF;
END;
/