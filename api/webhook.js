import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;
    
    // Extract transaction data sent by Flutterwave
    const txRef = payload.data?.tx_ref || payload.tx_ref; 
    const purchaseId = parseInt(txRef.replace('DTZ-PURCHASE-', ''));
    const providerRef = payload.data?.id || payload.id;

    // Securely connect to your Supabase Database
    const supabase = createClient(
      process.env.SUPABASE_URL, 
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // This triggers the successful payment code you ran earlier!
    const { data, error } = await supabase.rpc('process_successful_payment', {
      p_purchase_id: purchaseId,
      p_provider_reference: String(providerRef)
    });

    if (error) throw error;

    return res.status(200).json({ success: true, status: data });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
