import javax.swing.*;

public class TwoInputFieldsGUI {
    public static void main(String[] args) {
        // Create the frame
        JFrame frame = new JFrame("Two Input Fields GUI");

        // Create two input fields
        JTextField urlField = new JTextField(20);
        JTextField searchTopicField = new JTextField(20);

        // Create a panel to hold the input fields
        JPanel panel = new JPanel();
        panel.add(new JLabel("Input URL to be scraped: "));
        panel.add(urlField);
        panel.add(new JLabel("Input word or phrase to look for: "));
        panel.add(searchTopicField);

        JButton scrapeButton = new JButton("Retrieve data");
        panel.add(scrapeButton);
        // Add the panel to the frame
        frame.getContentPane().add(panel);

        // Set frame properties
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(500, 160);
        frame.setVisible(true);

        scrapeButton.addActionListener(e -> {
            String url = urlField.getText();
            String searchPhrase = searchTopicField.getText();
            // send data to node app
            System.out.println("URL: " + url);
            System.out.println("Search Phrase: " + searchPhrase);
        });
    }
}