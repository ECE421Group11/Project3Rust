/* tslint:disable */
/* eslint-disable */
/**
*/
export function greet(): void;
/**
* @param {number} val 
* @returns {number} 
*/
export function player_move(val: number): number;
/**
* @returns {string} 
*/
export function return_name(): string;
/**
* @param {string} game_number 
* @param {string} game_type 
* @param {string} player1_name 
* @param {string} player2_name 
* @param {string} winner_name 
*/
export function insert_game(game_number: string, game_type: string, player1_name: string, player2_name: string, winner_name: string): void;
/**
* @param {string} player_name 
* @returns {number} 
*/
export function get_number_of_games(player_name: string): number;
/**
* @param {string} player_name 
* @returns {number} 
*/
export function get_number_of_games_won(player_name: string): number;
/**
* @param {string} player_name 
* @returns {Array<any>} 
*/
export function get_all_games(player_name: string): Array<any>;
/**
* @param {string} player_name 
* @returns {Array<any>} 
*/
export function get_all_games_won(player_name: string): Array<any>;
/**
*/
export function clear_db(): void;
/**
*/
export function add_data(): void;
