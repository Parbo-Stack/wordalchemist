// src/utils/multiplayer.ts
import { supabase } from './supabase';

export async function createSession(playerId: string) {
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min from now

  const { data, error } = await supabase.from('multiplayer_sessions').insert({
    invite_code: inviteCode,
    expires_at: expiresAt,
    player1_id: playerId,
    game_state: {},
  }).select().single();

  if (error) throw error;

  return data;
}

export async function joinSession(inviteCode: string, playerId: string) {
  const { data, error } = await supabase
    .from('multiplayer_sessions')
    .update({ player2_id: playerId })
    .eq('invite_code', inviteCode)
    .gt('expires_at', new Date().toISOString())
    .is('player2_id', null)
    .select()
    .single();

  if (error || !data) throw new Error('Invalid or expired invite code');

  return data;
}
