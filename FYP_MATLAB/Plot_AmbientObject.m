clear all;

s = serial('COM10');      % Hardware interface definition
set(s,'BaudRate',9600); % Transmission BaudRate
fopen(s);                    % Connect the hardware interface
 
interval = 10000; 
passo = 1;
t = 1;
Ambient = [];               % Array for ambient temperatures
Object = [];                 % Array for object temperatures
i = 0;

while(t<interval)
    i = i + 1;
    b = str2num(fgetl(s));          % Use the function fget(s) to read the serial data from the buffer and stop when the terminator (newline character) appears.
    % Serial.println() in the Arduino program
    if mod(i,2) == 1                   % Odd lines in Arduino program screen monitor
        Ambient = [Ambient,b];    
    else Object = [Object, b];     % Even lines in Arduino program screen monitor
    end

    figure(1)
    plot(Ambient);
    grid;
    drawnow;                            % Plot points for real-time ambient temperatures and connect them together
    hold on
    plot(Object);                        % Plot points for real-time object temperatures and connect them together
    grid;
    drawnow;
    hold off
    ylim([20 45])                         % Set Y axis display range
    xlabel('time (s)')                                   % X label
    ylabel('Temperature (Celsius degree)')      % Y label
    legend('Ambient Temperature', 'Human skin Temperature')  % legend descriptions
end
fclose(s);                                  % Disconnecting hardware interface