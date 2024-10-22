import { Injectable, inject } from '@angular/core';
import { Auth, onAuthStateChanged, user } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export interface Task {
  id?: string;
  content: string;
  completed: boolean; 
  user?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private collectionRef: CollectionReference;
  private tasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  private tasksSub!: Subscription;

  constructor() { 
    this.collectionRef = collection(this.firestore, 'tasks');
    this.subscribeToAuthState();
  }

  private subscribeToAuthState(){
    onAuthStateChanged(this.auth, (user) => {
      if(user){
        this.subscribeToTasks(user.uid);
      }else{
        this.unsubscribeFromTasks();
      }
    });
  }

  private subscribeToTasks(userId: string): void{
    const tasksQuery = query(this.collectionRef, where('user', '==', userId));

    const tasks$ = collectionData(tasksQuery, { idField: 'id' }) as Observable<Task[]>;
    this.tasksSub = tasks$.subscribe((tasks) => {
      this.tasks$.next(tasks);
    });
  }

  private unsubscribeFromTasks(): void{
    this.tasks$.next([]);
    if(this.tasksSub){
      this.tasksSub.unsubscribe();
    }
  }

  async createTask(task: Task){
    try{
      await addDoc(this.collectionRef, {
        ...task,
        user: this.auth.currentUser?.uid,
      })
    } catch(error){
      console.error('Error creating task', error);
    }
  }

  readTasks(){
    return this.tasks$.asObservable();
  }

  updateTask(task: Task){
    const ref = doc(this.firestore, `tasks/${task.id}`);
    return updateDoc(ref, {content: task.content  });
  }

  async deleteTask(task: Task){
    try{
      const ref = doc(this.firestore, `tasks/${task.id}`);
      await deleteDoc(ref);
    }catch(error){
      console.error('Error deleting task', error);
    }
  }

  
}
