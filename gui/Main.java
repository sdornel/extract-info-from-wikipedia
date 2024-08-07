import javax.swing.*;
import java.awt.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;

public class Main {
    public static void main(String[] args) {
        // Create the frame
        JFrame frame = new JFrame("Wikipedia Scraper. Make Your Selections.");

        // Create two input fields
        JTextField urlField = new JTextField(20);
        JTextField searchTopicField = new JTextField(20);

        // Create panel for input fields
        JPanel inputPanel = new JPanel();
        inputPanel.setLayout(new GridLayout(2, 2, 5, 5)); // Grid layout for input fields
        inputPanel.add(new JLabel("Input URL to be scraped: "));
        inputPanel.add(urlField);
        inputPanel.add(new JLabel("Input word or phrase to look for: "));
        inputPanel.add(searchTopicField);

        // Create panel for radio buttons
        JPanel radioPanel = new JPanel();
        // radioPanel.setLayout(new BoxLayout(radioPanel, BoxLayout.Y_AXIS)); // Box layout for radio buttons
        ButtonGroup buttonGroup = new ButtonGroup();

        // Create the first radio button
        JRadioButton radioButton1 = new JRadioButton("(WIP) Do not combine nearby references (default)");
        radioButton1.setBounds(100, 50, 100, 30);

        // Create the second radio button
        JRadioButton radioButton2 = new JRadioButton("(WIP) Combine nearby references");
        radioButton2.setBounds(100, 100, 100, 30);

        buttonGroup.add(radioButton1);
        buttonGroup.add(radioButton2);

        radioPanel.add(radioButton1);
        radioPanel.add(radioButton2);

        // Add the panels to the main panel
        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout());
        mainPanel.add(inputPanel, BorderLayout.NORTH);
        mainPanel.add(radioPanel, BorderLayout.CENTER);

        JButton scrapeButton = new JButton("Retrieve data");
        mainPanel.add(scrapeButton, BorderLayout.SOUTH);

        // Add the main panel to the frame
        frame.getContentPane().add(mainPanel);

        // Set frame properties
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(500, 250); // Adjusted height to accommodate the space
        frame.setVisible(true);

        // Action listener for the button
        scrapeButton.addActionListener(e -> {
            String url = urlField.getText();
            String searchPhrase = searchTopicField.getText();
            // send data to node app
            System.out.println("(java) URL: " + url);
            System.out.println("(java) Search Phrase: " + searchPhrase);

            startNodeApplication(url, searchPhrase);
        });
    }

    private static void startNodeApplication(String url, String searchPhrase) {
        try {
            // Start the Node.js application by executing a command
            ProcessBuilder processBuilder = new ProcessBuilder("node", "../index.js", url, searchPhrase);
            Process process = processBuilder.start();

            // Read the output from the Node.js application
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            // Wait for the process to finish
            int exitCode = process.waitFor();
            System.out.println("Node.js application exited with code " + exitCode);
        } catch (IOException | InterruptedException ex) {
            ex.printStackTrace();
        }
    }
}