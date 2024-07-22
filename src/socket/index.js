import io from 'socket.io-client';

const SOCKET_URL = 'http://178.63.104.183:4000';

class WSService {
    initializeSocket = async() => {
        try {
            this.socket = io(SOCKET_URL, {
                transports: ['websocket'],
            });
            this.socket.on('connect', data => {
                console.log('---------- User connected -----------');
            });
            this.socket.on('disconnect', data => {
                console.log('---------- User disconnected -----------');
            });
            this.socket.on('error', data => {
                console.log('socket error: ', data);
            });
        } catch (error) {
            console.log('socket is not initialized: ', error);
        }
    };

    emit(event, data = {}, cb) {
        this.socket.emit(event, data, cb);
    }

    on(event, cb) {
        this.socket.on(event, cb);
    }

    off(event, cb) {
        this.socket.off(event, cb);
    }

    removeListener(listenerName) {
        this.socket.removeListener(listenerName);
    }
}

const userSocket = new WSService();

export default userSocket;