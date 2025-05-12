
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Gift, AlertCircle, Loader2 } from "lucide-react";

interface CreditsManagerProps {
  userId: string | undefined;
}

// Separate component for displaying credits
const CreditsDisplay = ({ credits }: { credits: number | null }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          {credits !== null ? credits : 0}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Available credits
        </div>
      </div>
    </div>
  );
};

// Component for coupon redemption
const CouponRedeemer = ({ 
  userId, 
  onCouponRedeem, 
  isLoading 
}: { 
  userId: string | undefined;
  onCouponRedeem: (credits: number) => void;
  isLoading: boolean;
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const { toast } = useToast();

  const handleRedeemCoupon = async () => {
    if (!userId || !couponCode.trim()) return;
    
    setRedeeming(true);
    try {
      // Check if the coupon code is valid
      const couponPattern = /^(\d+)MeigdAI$/;
      const match = couponCode.match(couponPattern);
      
      if (!match) {
        toast({
          title: "Invalid Coupon",
          description: "The coupon code is not valid. Format should be like '100MeigdAI'",
          variant: "destructive",
        });
        setRedeeming(false);
        return;
      }
      
      // Extract the number from the coupon code
      const creditsToAdd = parseInt(match[1]);
      
      if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
        toast({
          title: "Invalid Coupon",
          description: "The coupon code is not valid",
          variant: "destructive",
        });
        setRedeeming(false);
        return;
      }
      
      // Get current credits using maybeSingle instead of single
      const { data, error: fetchError } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      
      if (!data) {
        // If no record exists, create one
        const { error: insertError } = await supabase
          .from("user_credits")
          .insert({ user_id: userId, credits: creditsToAdd });
          
        if (insertError) throw insertError;
        
        onCouponRedeem(creditsToAdd);
      } else {
        // Update credits
        const newCredits = (data.credits || 0) + creditsToAdd;
        
        const { error: updateError } = await supabase
          .from("user_credits")
          .update({ credits: newCredits })
          .eq("user_id", userId);
          
        if (updateError) throw updateError;
        
        onCouponRedeem(newCredits);
      }
      
      setCouponCode("");
      
      toast({
        title: "Coupon Redeemed",
        description: `Added ${creditsToAdd} credits to your account!`,
      });
      
    } catch (error: any) {
      console.error("Error redeeming coupon:", error);
      toast({
        title: "Error",
        description: "Failed to redeem coupon: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="pt-2">
      <div className="flex items-center mb-2">
        <Gift className="h-4 w-4 mr-1 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Coupon Code</p>
      </div>
      <div className="flex gap-2">
        <Input
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code (e.g., 100MeigdAI)"
          className="flex-1 bg-background/30 border-white/5"
          disabled={isLoading || redeeming}
        />
        <Button 
          onClick={handleRedeemCoupon}
          disabled={redeeming || !couponCode.trim() || isLoading}
          variant="outline"
        >
          {redeeming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Redeem"
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Enter a valid coupon code to add more credits (e.g., 100MeigdAI)
      </p>
    </div>
  );
};

// Main component
const CreditsManager: React.FC<CreditsManagerProps> = ({ userId }) => {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCredits = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Make sure the auth session is valid before trying to fetch data
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session found");
      }

      const { data, error } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        setCredits(data.credits);
      } else {
        // If no record exists, create one with default credits (250)
        const { error: insertError, data: insertData } = await supabase
          .from("user_credits")
          .insert({ user_id: userId, credits: 250 })
          .select();
          
        if (insertError) throw insertError;
        
        if (insertData && insertData.length > 0) {
          setCredits(250);
          toast({
            title: "Welcome Gift!",
            description: "You've received 250 free credits to start with!",
          });
        }
      }
    } catch (error: any) {
      console.error("Error fetching credits:", error);
      setError("Failed to load your credits. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load your credits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Try to fetch credits whenever userId changes
  useEffect(() => {
    if (userId) {
      fetchCredits();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleCreditUpdate = (newCredits: number) => {
    setCredits(newCredits);
  };

  // Loading state
  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-20">
            <div className="flex space-x-2">
              {Array(3).fill(0).map((_, i) => (
                <div 
                  key={i}
                  className="h-3 w-3 rounded-full bg-blue-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchCredits()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-lg">Credits</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <CreditsDisplay credits={credits} />
          
          {credits === 0 && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3 text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                You've run out of credits. Please redeem a coupon to continue using the service.
              </span>
            </div>
          )}
          
          <CouponRedeemer 
            userId={userId} 
            onCouponRedeem={handleCreditUpdate}
            isLoading={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditsManager;
