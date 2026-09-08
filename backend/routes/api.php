<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;

Route::apiResource('projects', ProjectController::class);
Route::get('projects/{project}/tasks', [TaskController::class, 'index']);
Route::post('projects/{project}/tasks', [TaskController::class, 'store']);
Route::put('tasks/{task}', [TaskController::class, 'update']);
Route::delete('tasks/{task}', [TaskController::class, 'destroy']);