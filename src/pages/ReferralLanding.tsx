import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * /ref/:code → stores the referral code in sessionStorage and redirects to /auth (signup mode)
 */
const ReferralLanding = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      sessionStorage.setItem("referral_code", code);
    }
    navigate("/auth?ref=1", { replace: true });
  }, [code, navigate]);

  return null;
};

export default ReferralLanding;
